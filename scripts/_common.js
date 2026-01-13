import fs from "fs";

export function readJson(filePath) {
  const s = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(s);
}

export function printUsage(cmd, usage) {
  console.log(`\nUsage: ${cmd} ${usage}\n`);
}
