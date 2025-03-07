const fs = require("fs");
const path = require("path");

const tsconfigPath = path.join(__dirname, "tsconfig.json");

if (fs.existsSync(tsconfigPath)) {
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf8"));

  if (tsconfig.compilerOptions) {
    tsconfig.compilerOptions.jsx = "react-jsx";
  }

  fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
  console.log("jsx = react-jsx");
} else {
  process.exit(1);
}