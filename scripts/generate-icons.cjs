const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SVG_PATH = "public/icon.svg";
const OUT_DIR = "public";
const ASSETS_DIR = "assets";

const sizes = [
  // PWA icons
  { name: "icon-192x192.png", size: 192 },
  { name: "icon-512x512.png", size: 512 },
  // Apple touch icon
  { name: "apple-touch-icon.png", size: 180 },
  // Favicon
  { name: "favicon.png", size: 64 },
  // Windows ICO source (32px)
  { name: "favicon-32.png", size: 32 },
  // Windows store logos
  { name: path.join(ASSETS_DIR, "windows", "store-logo-71.png"), size: 71 },
  { name: path.join(ASSETS_DIR, "windows", "store-logo-150.png"), size: 150 },
  { name: path.join(ASSETS_DIR, "windows", "store-logo-310.png"), size: 310 },
  { name: path.join(ASSETS_DIR, "windows", "store-logo-310x150.png"), size: 310 },
  // macOS iconset
  { name: path.join(ASSETS_DIR, "icon.iconset", "icon_16x16.png"), size: 16 },
  { name: path.join(ASSETS_DIR, "icon.iconset", "icon_16x16@2x.png"), size: 32 },
  { name: path.join(ASSETS_DIR, "icon.iconset", "icon_32x32.png"), size: 32 },
  { name: path.join(ASSETS_DIR, "icon.iconset", "icon_32x32@2x.png"), size: 64 },
  { name: path.join(ASSETS_DIR, "icon.iconset", "icon_128x128.png"), size: 128 },
  { name: path.join(ASSETS_DIR, "icon.iconset", "icon_128x128@2x.png"), size: 256 },
  { name: path.join(ASSETS_DIR, "icon.iconset", "icon_256x256.png"), size: 256 },
  { name: path.join(ASSETS_DIR, "icon.iconset", "icon_256x256@2x.png"), size: 512 },
  { name: path.join(ASSETS_DIR, "icon.iconset", "icon_512x512.png"), size: 512 },
  { name: path.join(ASSETS_DIR, "icon.iconset", "icon_512x512@2x.png"), size: 1024 },
  // iOS icons
  { name: path.join(ASSETS_DIR, "ios-icons", "icon-40.png"), size: 40 },
  { name: path.join(ASSETS_DIR, "ios-icons", "icon-58.png"), size: 58 },
  { name: path.join(ASSETS_DIR, "ios-icons", "icon-60.png"), size: 60 },
  { name: path.join(ASSETS_DIR, "ios-icons", "icon-80.png"), size: 80 },
  { name: path.join(ASSETS_DIR, "ios-icons", "icon-87.png"), size: 87 },
  { name: path.join(ASSETS_DIR, "ios-icons", "icon-120.png"), size: 120 },
  { name: path.join(ASSETS_DIR, "ios-icons", "icon-180.png"), size: 180 },
  { name: path.join(ASSETS_DIR, "ios-icons", "icon-1024.png"), size: 1024 },
  // Android adaptive icons (foreground for launcher)
  { name: path.join(ASSETS_DIR, "android", "drawable", "ic_launcher_foreground.png"), size: 432 },
  // Android mipmap launcher icons
  { name: path.join(ASSETS_DIR, "android", "mipmap-mdpi", "ic_launcher.png"), size: 48 },
  { name: path.join(ASSETS_DIR, "android", "mipmap-hdpi", "ic_launcher.png"), size: 72 },
  { name: path.join(ASSETS_DIR, "android", "mipmap-xhdpi", "ic_launcher.png"), size: 96 },
  { name: path.join(ASSETS_DIR, "android", "mipmap-xxhdpi", "ic_launcher.png"), size: 144 },
  { name: path.join(ASSETS_DIR, "android", "mipmap-xxxhdpi", "ic_launcher.png"), size: 192 },
  // Play store icon
  { name: path.join(ASSETS_DIR, "android", "play-store-icon.png"), size: 512 },
  // iOS splash screens (icon only, not full splash)
  // OG image - we'll use the existing one, it's fine
];

async function main() {
  const svgBuffer = fs.readFileSync(SVG_PATH);

  for (const { name, size } of sizes) {
    const dir = path.dirname(name);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    try {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(name);
      console.log(`✅ ${name} (${size}x${size})`);
    } catch (err) {
      console.error(`❌ ${name}: ${err.message}`);
    }
  }

  console.log("\nDone! All icons regenerated from SVG.");
}

main().catch(console.error);
