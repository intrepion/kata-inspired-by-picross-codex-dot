// Read-only verification. Never rewrite old captures with new build provenance.
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const sha = b => createHash('sha256').update(b).digest('hex');
const manifest = JSON.parse(await readFile('public/arcade/manifest.json','utf8'));
const inputs = {};
async function inventory(dir,prefix='') {
 for (const entry of (await readdir(dir,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))) {
  const name=prefix+entry.name;
  if (name==='arcade') continue;
  if (entry.isDirectory()) await inventory(resolve(dir,entry.name),name+'/');
  else inputs[name]=sha(await readFile(resolve(dir,entry.name)));
 }
}
await inventory(resolve('dist'));
for(const screenshot of manifest.screenshots) {
 assert.deepEqual(inputs,screenshot.provenance.inputHashes,'Served game changed: take and review new genuine HTTP gameplay captures; never relabel old images.');
}
console.log(`Verified ${manifest.screenshots.length} gameplay captures against ${Object.keys(inputs).length} unchanged production inputs.`);
