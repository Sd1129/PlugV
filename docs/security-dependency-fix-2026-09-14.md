# Dependency remediation — 14 September 2026

The time-limited deepmerge-ts exception has been removed. The security audit now fails on high/critical production advisories and on incomplete/error npm audit responses.

## Targeted override

Prisma 7.9.1 uses @prisma/config, whose deepmerge-ts 7.1.5 dependency is affected by GHSA-ggr8-5vv4-36mx. Prisma 7.10.0 still pins that version as of this check, so upgrading Prisma alone does not fix it.

Pin deepmerge-ts 8.0.0 only under @prisma/config using an npm override. Upstream v8 fixes recursive object merging; its Map merging and some type exports have breaking changes. PlugV's Prisma config contains ordinary schema/migration/datasource configuration, not Maps or those renamed types. Confirmed configuration loading and `prisma validate` with a non-network dummy connection string. No database migrations or live database writes were performed.

References:
- https://github.com/advisories/GHSA-ggr8-5vv4-36mx
- https://github.com/RebeccaStevens/deepmerge-ts/releases/tag/v8.0.0

Remove this override when Prisma adopts a patched version natively; recheck config loading and schema validation on Prisma upgrades. It is an application-tested override, not an upstream Prisma compatibility guarantee.

## Development dependency

Updated js-yaml 4.3.1 to 4.3.2 through the existing dependency range to address GHSA-2883-xcg3-v3hh. No broad major-version dependency upgrade was performed.

After installation, npm audit including development dependencies reported zero vulnerabilities. This is a point-in-time dependency advisory check, not a claim that the whole application is vulnerability-free.
