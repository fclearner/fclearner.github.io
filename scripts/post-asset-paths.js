'use strict';

const path = require('path');

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function joinUrl(...parts) {
  return parts
    .join('/')
    .replace(/\/{2,}/g, '/')
    .replace(/\/?$/, '/');
}

hexo.extend.filter.register('after_post_render', data => {
  if (!data.content || !data.path) return data;

  const slug = data.slug || path.basename(data.source || '', path.extname(data.source || ''));
  if (!slug) return data;

  const root = hexo.config.root || '/';
  const postAssetBase = joinUrl(root, data.path);
  const pattern = new RegExp(`(\\ssrc=["'])/?${escapeRegExp(slug)}/`, 'g');

  data.content = data.content.replace(pattern, `$1${postAssetBase}`);
  return data;
});
