import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const sha=b=>createHash('sha256').update(b).digest('hex');
test('reviewed gameplay images retain original bytes and valid capture provenance',()=>{
 const m=JSON.parse(readFileSync('public/arcade/manifest.json','utf8'));assert.equal(m.schemaVersion,3);assert.equal(m.screenshots.length,2);
 for(const s of m.screenshots){const p=s.provenance;const raw=readFileSync('public/'+s.path),original=readFileSync('public/'+p.sourcePath),recordBytes=readFileSync('public/'+p.captureRecordPath),r=JSON.parse(recordBytes);assert.equal(raw[0],255);assert.equal(raw[1],216);assert.equal(sha(raw),s.sha256);assert.equal(sha(original),p.sourceSha256);assert.deepEqual(raw,original);assert.equal(sha(recordBytes),p.captureRecordSha256);assert.equal(r.sourceCommit,p.captureCommit);assert.deepEqual(r.inputs,p.inputHashes);assert.equal(r.capturedAt,p.capturedAt);assert.equal(r.tool.name,'cua_repl');assert.equal(new URL(r.baseUrl).hostname,'127.0.0.1');assert.equal(p.kind,'local_gameplay_capture');assert.ok(r.steps.length>=5);assert.ok(Object.keys(p.inputHashes).length>=4);}
});
