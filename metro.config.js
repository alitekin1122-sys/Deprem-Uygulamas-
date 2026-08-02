const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const config = getDefaultConfig(__dirname);

// JSON dosyalarını asset olarak tanımla
config.resolver.assetExts = config.resolver.assetExts || [];
if (!config.resolver.assetExts.includes("json")) {
  config.resolver.assetExts.push("json");
}

module.exports = withNativeWind(config, {
  input: "./global.css",
  // Force write CSS to file system instead of virtual modules
  // This fixes iOS styling issues in development mode
  forceWriteFileSystem: true,
});
