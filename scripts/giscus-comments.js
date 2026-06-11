'use strict';

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function boolFlag(value, defaultValue) {
  if (typeof value === 'boolean') return value ? '1' : '0';
  if (value === undefined || value === null || value === '') return defaultValue ? '1' : '0';
  if (value === '1' || value === 1) return '1';
  if (value === '0' || value === 0) return '0';
  return value ? '1' : '0';
}

function normalizeGiscusConfig(config = {}) {
  return {
    enable: Boolean(config.enable),
    repo: config.repo || '',
    repoId: config.repo_id || config.repoId || '',
    category: config.category || '',
    categoryId: config.category_id || config.categoryId || '',
    mapping: config.mapping || 'pathname',
    strict: boolFlag(config.strict, false),
    reactionsEnabled: boolFlag(config.reactions_enabled ?? config.reactionsEnabled, true),
    emitMetadata: boolFlag(config.emit_metadata ?? config.emitMetadata, false),
    inputPosition: config.input_position || config.inputPosition || 'bottom',
    theme: config.theme || 'preferred_color_scheme',
    lang: config.lang || 'zh-CN',
    loading: config.loading || ''
  };
}

function missingRequiredConfig(config) {
  const missing = [];
  if (!config.repo) missing.push('repo');
  if (!config.repoId) missing.push('repo_id');
  if (!config.category) missing.push('category');
  if (!config.categoryId) missing.push('category_id');
  return missing;
}

function buildGiscusEmbed(rawConfig = {}) {
  const config = normalizeGiscusConfig(rawConfig);
  const missing = missingRequiredConfig(config);
  if (missing.length) {
    return [
      '<div class="comments giscus-container giscus-config-pending"',
      ` data-missing="${escapeAttr(missing.join(','))}"></div>`
    ].join('');
  }

  const attrs = [
    ['src', 'https://giscus.app/client.js'],
    ['data-repo', config.repo],
    ['data-repo-id', config.repoId],
    ['data-category', config.category],
    ['data-category-id', config.categoryId],
    ['data-mapping', config.mapping],
    ['data-strict', config.strict],
    ['data-reactions-enabled', config.reactionsEnabled],
    ['data-emit-metadata', config.emitMetadata],
    ['data-input-position', config.inputPosition],
    ['data-theme', config.theme],
    ['data-lang', config.lang],
    ['crossorigin', 'anonymous']
  ];
  if (config.loading) attrs.push(['data-loading', config.loading]);

  const serializedAttrs = attrs
    .map(([name, value]) => `${name}="${escapeAttr(value)}"`)
    .join('\n        ');

  return [
    '<div class="comments giscus-container">',
    '  <div class="giscus"></div>',
    `  <script ${serializedAttrs}`,
    '        async>',
    '  </script>',
    '</div>'
  ].join('\n');
}

function register(hexoInstance) {
  hexoInstance.extend.filter.register('theme_inject', injects => {
    const config = hexoInstance.theme.config.giscus || {};
    if (!config.enable) return;

    const normalized = normalizeGiscusConfig(config);
    const missing = missingRequiredConfig(normalized);
    if (missing.length) {
      hexoInstance.log.warn(`giscus config is incomplete: ${missing.join(', ')}.`);
    }

    injects.comment.raw('giscus', buildGiscusEmbed(config), {
      configKey: 'giscus',
      class: 'giscus',
      button: 'Giscus'
    }, { cache: true });
  });
}

if (typeof hexo !== 'undefined') register(hexo);

module.exports = {
  buildGiscusEmbed,
  missingRequiredConfig,
  normalizeGiscusConfig
};
