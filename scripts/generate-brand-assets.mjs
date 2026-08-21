import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const brand = join(root, "public", "brand");
const icon = await readFile(join(brand, "logo-icon.svg"));
const wordmarkDark = await readFile(join(brand, "logo-horizontal.svg"));
const wordmarkLight = await readFile(join(brand, "logo-horizontal-light.svg"));

await Promise.all([
  sharp(icon).resize(1024, 1024).flatten({ background: "#020817" }).png().toFile(join(brand, "app-icon-1024.png")),
  sharp(icon).resize(512, 512).flatten({ background: "#020817" }).png().toFile(join(brand, "logo-icon.png")),
  sharp(icon).resize(512, 512).flatten({ background: "#020817" }).png().toFile(join(brand, "android-icon-512.png")),
  sharp(icon).resize(192, 192).flatten({ background: "#020817" }).png().toFile(join(brand, "android-icon-192.png")),
  sharp(icon).resize(180, 180).flatten({ background: "#020817" }).png().toFile(join(brand, "apple-touch-icon.png")),
  sharp(icon).resize(32, 32).png().toFile(join(brand, "favicon-32.png")),
  sharp(wordmarkDark).png().toFile(join(brand, "logo-dark.png")),
  sharp(wordmarkLight).png().toFile(join(brand, "logo-light.png")),
]);

const socialBackground = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="a" cx="0" cy="0" r="1" gradientTransform="translate(220 120) rotate(35) scale(620 440)" gradientUnits="userSpaceOnUse"><stop stop-color="#0EA5E9" stop-opacity=".28"/><stop offset="1" stop-color="#020817" stop-opacity="0"/></radialGradient><radialGradient id="b" cx="0" cy="0" r="1" gradientTransform="translate(1020 560) rotate(-140) scale(520 380)" gradientUnits="userSpaceOnUse"><stop stop-color="#10B981" stop-opacity=".18"/><stop offset="1" stop-color="#020817" stop-opacity="0"/></radialGradient></defs><rect width="1200" height="630" rx="52" fill="#020817"/><rect width="1200" height="630" rx="52" fill="url(#a)"/><rect width="1200" height="630" rx="52" fill="url(#b)"/><rect x="1" y="1" width="1198" height="628" rx="51" fill="none" stroke="#7DD3FC" stroke-opacity=".14" stroke-width="2"/></svg>`);
const wordmarkForSocial = await sharp(wordmarkDark).resize({ width: 820 }).png().toBuffer();
await sharp(socialBackground).composite([{ input: wordmarkForSocial, gravity: "centre" }]).png().toFile(join(brand, "plugv-social-card.png"));

console.log("PlugV brand assets generated.");
