'use strict';

const nodeFs = require('fs');
const hexoFs = require('hexo-fs');
const path = require('path');
const nunjucks = require('nunjucks');
const toArray = require('hexo-renderer-nunjucks/lib/to_array');

function collectDirectories(dir) {
  const dirs = [dir];
  for (const entry of nodeFs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      dirs.push(...collectDirectories(path.join(dir, entry.name)));
    }
  }
  return dirs;
}

function createEnvironment(hexo) {
  const themeDir = hexo.theme_dir || path.join(hexo.base_dir, 'themes', hexo.config.theme);
  const layoutDir = path.join(themeDir, 'layout');
  const env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader([...collectDirectories(layoutDir), themeDir, hexo.base_dir], {
      noCache: true
    }),
    {
      autoescape: false,
      throwOnUndefined: false,
      trimBlocks: false,
      lstripBlocks: false,
      noCache: true
    }
  );

  env.addFilter('toArray', toArray);
  return env;
}

function createRenderer(hexo) {
  const env = createEnvironment(hexo);

  function render(data, locals) {
    if ('text' in data) {
      return env.renderString(data.text, locals);
    }

    return env.render(data.path, locals);
  }

  function compile(data) {
    const source = 'text' in data ? data.text : hexoFs.readFileSync(data.path);
    const template = nunjucks.compile(source, env, data.path);

    return template.render.bind(template);
  }

  render.compile = compile;
  return render;
}

const renderer = createRenderer(hexo);
hexo.extend.renderer.register('njk', 'html', renderer, true);
hexo.extend.renderer.register('j2', 'html', renderer, true);
