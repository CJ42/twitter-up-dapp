const { copyAssets } = require("@lukso/web-components/tools/copy-assets.cjs");
// @ts-ignore
const { assets } = require("@lukso/web-components/tools/assets/index.cjs");

copyAssets("./public", assets);

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
