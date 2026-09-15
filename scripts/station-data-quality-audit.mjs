import { createRequire } from 'node:module';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import Module from 'node:module';
const require = createRequire(import.meta.url);
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }}).outputText, filename);
const {stationDataIssues, publishableStations} = require('../lib/charging/stationDataQuality.ts');
const valid = { id:'test', name:'Test', operator:'Tata Power', latitude:13, longitude:80, connectors:{ccs2:true}, charging:{maxPowerKW:60}, trust:{verified:false}, availability:{status:'unknown'} };
assert.deepEqual(stationDataIssues(valid), []);
for(const maxPowerKW of [1000000, NaN, Infinity, -1, 0]) assert.ok(stationDataIssues({...valid,charging:{maxPowerKW}}).includes('power requires review'));
assert.ok(stationDataIssues({...valid,operator:'Operator not listed'}).includes('operator missing'));
assert.ok(stationDataIssues({...valid,connectors:{ccs2:false}}).includes('connector not identified'));
assert.ok(stationDataIssues({...valid,latitude:91}).includes('invalid coordinates'));
for (const operator of ['(Unknown Operator)', ' unknown operator ', '(Business Owner at Location)', 'N/A']) assert.ok(stationDataIssues({...valid,operator}).includes('operator missing'));
assert.deepEqual(stationDataIssues({...valid,operator:'Chargezone (India)'}), []);
const out = publishableStations([valid,{...valid,charging:{maxPowerKW:1000000}}]);
assert.equal(out.length,1);
assert.equal(out[0],valid);
assert.equal(valid.trust.verified,false);
assert.equal(valid.availability.status,'unknown');
console.log('PASS station quality: outliers, missing operator/connector and invalid coordinates excluded; source and unknown status preserved.');

// Simulate the provider's compact response contract without touching a database.
const writes = [];
const originalLoad = Module._load;
Module._load = function(id, ...args) {
  if (id === '@/lib/prisma') return {prisma: {
    city: {upsert: async () => ({id:'test-city'})},
    station: {upsert: async (input) => writes.push(input)},
    stationSource: {deleteMany: async () => {}, create: async () => {}},
  }};
  if (id === '@/lib/charging/ensureChargingSchema') return {ensureChargingSchema: async () => {}};
  return originalLoad.call(this, id, ...args);
};
const oldFetch = globalThis.fetch;
const oldKey = process.env.OCM_API_KEY;
try {
  process.env.OCM_API_KEY = 'test-only';
  globalThis.fetch = async (url) => {
    const compact = new URL(url).searchParams.get('compact') === 'true';
    return {ok:true, json:async () => [{ID:1,
      AddressInfo:{Title:'Test charger',Town:'Test',StateOrProvince:'Test',Latitude:13,Longitude:80},
      OperatorInfo:compact ? undefined : {Title:'Test operator'},
      Connections:[{PowerKW:60,ConnectionType:compact ? undefined : {Title:'CCS (Type 2)'}}],
    }]};
  };
  const {syncOpenChargeMapIndia} = require('../lib/charging/openChargeMapSync.ts');
  await syncOpenChargeMapIndia();
  assert.equal(writes.length,1);
  assert.equal(writes[0].create.operator,'Test operator');
  assert.equal(writes[0].create.ccs2,true);
  assert.equal(writes[0].create.sourceStatus,'PENDING');
  console.log('PASS sync retains provider operator and connector details without marking verified.');
} finally {
  Module._load = originalLoad;
  globalThis.fetch = oldFetch;
  if (oldKey === undefined) delete process.env.OCM_API_KEY;
  else process.env.OCM_API_KEY = oldKey;
}

