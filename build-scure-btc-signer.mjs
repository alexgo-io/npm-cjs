import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import stripJsonComments from 'strip-json-comments';

execSync('rm -rf scure-btc-signer', { stdio: 'inherit' });
execSync('git clone --depth 1 https://github.com/paulmillr/scure-btc-signer.git', { stdio: 'inherit' });

{
  const packageJson = JSON.parse(readFileSync("scure-btc-signer/package.json"));

  packageJson.name = "scure-btc-signer-cjs";
  packageJson.homepage = "https://github.com/alexgo-io/npm-cjs.git";
  packageJson.repository ={
    "type": "git",
    "url": "git+https://github.com/alexgo-io/npm-cjs.git"
  };
  packageJson.type = "commonjs";

  packageJson.dependencies['micro-packed-cjs'] = "0.3.2";

  console.log("package.json", packageJson);
  writeFileSync(
    "scure-btc-signer/package.json",
    JSON.stringify(packageJson, undefined, "\t")
  );
}

{
  const jsonText = stripJsonComments(readFileSync("scure-btc-signer/tsconfig.json", "utf-8"), {trailingCommas: true})
  const tsconfigJson = JSON.parse(jsonText);

  tsconfigJson.compilerOptions.module = "commonjs";
  tsconfigJson.compilerOptions.target = "es2020";
  tsconfigJson.compilerOptions.esModuleInterop = true;
  tsconfigJson.compilerOptions.moduleResolution = "node";

  console.log("tsconfig.json", tsconfigJson);

  writeFileSync(
    "scure-btc-signer/tsconfig.json",
    JSON.stringify(tsconfigJson, undefined, "\t")
  );
}

{
  const sourceCoreIndex = readFileSync("scure-btc-signer/index.ts", 'utf-8')
  .replaceAll('micro-packed', 'micro-packed-cjs');
  writeFileSync('scure-btc-signer/index.ts', sourceCoreIndex);
}

execSync('npm install', { cwd: 'scure-btc-signer', stdio: 'inherit' });
execSync('npm run build', { cwd: 'scure-btc-signer', stdio: 'inherit' });

execSync(`node -e "require('./scure-btc-signer')"`, { stdio: 'inherit' });
