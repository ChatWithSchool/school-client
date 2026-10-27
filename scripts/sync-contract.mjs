// Usage: npm run contract:sync [-- <path to school-server>]
// The API contract has one source: school-server/openapi/openapi.yaml. This copies it into the client,
// so nobody edits the client copy by hand. Default: the server repo is next to this one.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const serverDir = path.resolve(root, process.argv[2] ?? '../school-server');
const source = path.join(serverDir, 'openapi', 'openapi.yaml');
const target = path.join(root, 'openapi', 'openapi.yaml');

if (!fs.existsSync(source)) {
  console.error(`Contract not found: ${source}`);
  console.error(
    'Pull school-server next to this repo, or pass its path: npm run contract:sync -- <path>',
  );
  process.exit(1);
}
const before = fs.existsSync(target) ? fs.readFileSync(target) : null;
const after = fs.readFileSync(source);
if (before && before.equals(after)) {
  console.log('openapi/openapi.yaml is already up to date.');
} else {
  fs.writeFileSync(target, after);
  console.log(
    `Copied the contract from ${path.relative(root, source)}. Commit openapi/openapi.yaml.`,
  );
}
