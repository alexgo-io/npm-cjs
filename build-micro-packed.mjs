import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import stripJsonComments from 'strip-json-comments';

execSync('rm -rf micro-packed', { stdio: 'inherit' });
execSync('git clone --depth 1 https://github.com/paulmillr/micro-packed.git', { stdio: 'inherit' });

{
  const packageJson = JSON.parse(readFileSync("micro-packed/package.json"));

  packageJson.name = "micro-packed-cjs";
  packageJson.homepage = "https://github.com/alexgo-io/npm-cjs.git";
  packageJson.repository ={
    "type": "git",
    "url": "git+https://github.com/alexgo-io/npm-cjs.git"
  };
  packageJson.type = "commonjs";

  console.log("package.json", packageJson);
  writeFileSync(
    "micro-packed/package.json",
    JSON.stringify(packageJson, undefined, "\t")
  );
}


{
  const jsonText = stripJsonComments(readFileSync("micro-packed/tsconfig.json", "utf-8"), {trailingCommas: true})
  const tsconfigJson = JSON.parse(jsonText);

  tsconfigJson.compilerOptions.module = "commonjs";
  tsconfigJson.compilerOptions.target = "es2020";
  tsconfigJson.compilerOptions.esModuleInterop = true;
  tsconfigJson.compilerOptions.moduleResolution = "node";

  console.log("tsconfig.json", tsconfigJson);

  writeFileSync(
    "micro-packed/tsconfig.json",
    JSON.stringify(tsconfigJson, undefined, "\t")
  );
}

execSync('npm install', { cwd: 'micro-packed', stdio: 'inherit' });
execSync('npm run build', { cwd: 'micro-packed', stdio: 'inherit' });

execSync(`node -e "require('./micro-packed')"`, { stdio: 'inherit' });
