const { copyAssets } = require("@lukso/web-components/tools/copy-assets");
// @ts-ignore
const { assets } = require("@lukso/web-components/tools/assets");

copyAssets("./public", require.resolve("@lukso/web-components/tools/assets"));

module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // Rewrite everything else to use `pages/index`
      {
        source: "/:path*",
        destination: "/",
      },
    ];
  },
};
