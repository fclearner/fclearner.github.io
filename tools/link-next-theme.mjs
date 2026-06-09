import { existsSync, lstatSync, mkdirSync, realpathSync, rmSync, symlinkSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const root = process.cwd();
const target = resolve(root, 'node_modules/hexo-theme-next');
const link = resolve(root, 'themes/next');

if (!existsSync(target)) {
  throw new Error('Missing node_modules/hexo-theme-next. Run npm install first.');
}

mkdirSync(dirname(link), { recursive: true });

if (existsSync(link)) {
  const stat = lstatSync(link);
  if (stat.isSymbolicLink()) {
    if (realpathSync(link) === realpathSync(target)) {
      process.exit(0);
    }
    rmSync(link);
  } else {
    throw new Error('themes/next already exists and is not a symlink. Move it aside before linking the npm NexT theme.');
  }
}

symlinkSync(target, link, process.platform === 'win32' ? 'junction' : 'dir');
