import _RemarkEmoji from 'remark-emoji';
import _RehypeSlug from 'rehype-slug';
import _RehypeAutolinkHeadings from 'rehype-autolink-headings';

const remarkPlugins = {
  'remark-emoji': { instance: _RemarkEmoji },
};

const rehypePlugins = {
  'rehype-slug': { instance: _RehypeSlug },
  'rehype-autolink-headings': { instance: _RehypeAutolinkHeadings },
};

const highlight = {};

export { highlight, rehypePlugins, remarkPlugins };
//# sourceMappingURL=mdc-imports.mjs.map
