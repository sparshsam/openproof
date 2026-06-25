const fs = require("fs");
const sharp = require("sharp");

// ICO header: reserved(2) + type(2) + count(2)
// ICO directory entry: w(1) + h(1) + colors(1) + reserved(1) + planes(2) + bpp(2) + size(4) + offset(4)
// PNG data follows each directory entry

async function createIco(svgPath, outputPath, sizes) {
  const entries = [];
  const buffers = [];
  let offset = 6 + sizes.length * 16; // header + directory

  for (const size of sizes) {
    const png = await sharp(svgPath)
      .resize(size, size)
      .png()
      .toBuffer();

    const w = size >= 256 ? 0 : size;
    const h = size >= 256 ? 0 : size;
    const dir = Buffer.alloc(16);
    dir.writeUInt8(w, 0);       // width
    dir.writeUInt8(h, 1);       // height
    dir.writeUInt8(0, 2);       // colors
    dir.writeUInt8(0, 3);       // reserved
    dir.writeUInt16LE(1, 4);    // color planes
    dir.writeUInt16LE(32, 6);   // bits per pixel
    dir.writeUInt32LE(png.length, 8);  // size
    dir.writeUInt32LE(offset, 12);     // offset

    entries.push(dir);
    buffers.push(png);
    offset += png.length;
  }

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);     // reserved
  header.writeUInt16LE(1, 2);     // type: ICO
  header.writeUInt16LE(sizes.length, 4);  // count

  const ico = Buffer.concat([header, ...entries, ...buffers]);
  fs.writeFileSync(outputPath, ico);
  console.log(`✅ ${outputPath} (${sizes.join(", ")}px)`);
}

async function main() {
  await createIco("public/icon.svg", "public/favicon.ico", [16, 32, 48, 64]);
  await createIco("public/icon.svg", "assets/windows/icon.ico", [16, 32, 48, 64, 256]);

  // Android adaptive icon background (solid #0081cc)
  const bg = await sharp({
    create: {
      width: 432,
      height: 432,
      channels: 4,
      background: { r: 0, g: 129, b: 204, alpha: 1 }
    }
  }).png().toFile("assets/android/drawable/ic_launcher_background.png");
  console.log("✅ assets/android/drawable/ic_launcher_background.png");

  // OG image from source PNG
  const srcPng = fs.readFileSync("public/og-source.png");
  await sharp(srcPng)
    .resize(1200, 630, { fit: "cover" })
    .png()
    .toFile("public/og.png");
  console.log("✅ public/og.png (1200x630)");

  // Update manifest.json to reference SVG as icon source
  const manifestPath = "public/manifest.json";
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  manifest.icons = [
    { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    { src: "/icon-192x192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
    { src: "/icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
  ];
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log("✅ public/manifest.json updated with SVG icon");

  // Clean up temp files
  try { fs.unlinkSync("public/favicon-32.png"); } catch {}
  try { fs.unlinkSync("public/og-source.png"); } catch {}

  console.log("\nDone! All icons regenerated from SVG source.");
}

main().catch(console.error);
