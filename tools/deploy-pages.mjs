import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const deployDir = path.join(root, '.deploy_publish');
const args = process.argv.slice(2);
const push = args.includes('--push');
const messageArg = args.find(arg => !arg.startsWith('--'));
const message = messageArg || `Site updated: ${new Date().toISOString().slice(0, 10)}`;

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || root,
    encoding: 'utf8',
    stdio: options.capture ? 'pipe' : 'inherit'
  });
  if (result.status !== 0) {
    const detail = options.capture ? `${result.stdout || ''}${result.stderr || ''}` : '';
    throw new Error(`${command} ${args.join(' ')} failed.${detail ? `\n${detail}` : ''}`);
  }
  return result.stdout || '';
}

function assertInsideRoot(target, label) {
  const relative = path.relative(root, target);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`${label} is outside project root: ${target}`);
  }
}

function syncPublicToDeploy() {
  assertInsideRoot(deployDir, 'deployDir');
  if (!fs.existsSync(publicDir)) throw new Error('public/ does not exist. Run npm run build first.');
  if (!fs.existsSync(path.join(deployDir, '.git'))) {
    throw new Error('.deploy_publish is missing or is not a Git clone.');
  }

  for (const entry of fs.readdirSync(deployDir)) {
    if (entry === '.git') continue;
    fs.rmSync(path.join(deployDir, entry), { recursive: true, force: true });
  }

  for (const entry of fs.readdirSync(publicDir)) {
    fs.cpSync(path.join(publicDir, entry), path.join(deployDir, entry), {
      recursive: true,
      dereference: true
    });
  }
}

run('node', ['tools/check-generated-site.mjs']);
syncPublicToDeploy();
run('git', ['add', '-A'], { cwd: deployDir });

const status = run('git', ['status', '--porcelain'], { cwd: deployDir, capture: true }).trim();
if (!status) {
  console.log('No generated site changes to deploy.');
  process.exit(0);
}

run('git', ['commit', '-m', message], { cwd: deployDir });
if (push) run('git', ['push', 'origin', 'master'], { cwd: deployDir });
else console.log('Commit created but not pushed. Push with Windows Git or rerun with --push when credentials are available.');
