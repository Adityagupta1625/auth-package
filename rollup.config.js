const typescript = require("rollup-plugin-typescript2");

module.exports = {
  input: "src/index.ts",
  output: {
    dir: "output",
    format: "cjs",
  },
  plugins: [typescript()],
};
