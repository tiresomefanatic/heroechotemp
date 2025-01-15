import _sfc_main$1 from './ContentRenderer-D9s0Lb77.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, useSSRContext } from 'file:///Users/suprateek/Desktop/hero-echo/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent } from 'file:///Users/suprateek/Desktop/hero-echo/node_modules/vue/server-renderer/index.mjs';
import './ContentRendererMarkdown-4O677W8d.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/destr/dist/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/scule/dist/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/property-information/index.js';
import './node-BZyc0_pG.mjs';
import './preview-Jbyp4472.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/cookie-es/dist/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/h3/dist/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/ohash/dist/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/klona/dist/index.mjs';
import './server.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/ofetch/dist/node.mjs';
import '../nitro/nitro.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/ufo/dist/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/hookable/dist/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/unenv/runtime/fetch/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/defu/dist/defu.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/unstorage/dist/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/unstorage/drivers/fs.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/unstorage/drivers/fs-lite.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/unstorage/drivers/lru-cache.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/radix3/dist/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/unctx/dist/index.mjs';
import 'node:fs';
import 'node:url';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/pathe/dist/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/@iconify/utils/lib/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/unenv/runtime/npm/consola.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/@unhead/shared/dist/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/unhead/dist/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/vue-router/dist/vue-router.node.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/@vueuse/core/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/tailwind-merge/dist/bundle-mjs.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/@iconify/vue/dist/iconify.mjs';
import '../_/renderer.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/devalue/index.js';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/@unhead/ssr/dist/index.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "MarkdownRenderer",
  __ssrInlineRender: true,
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const components = {
      style: "style",
      p: "p",
      div: "div",
      img: "img"
      // Add other components as needed
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ContentRenderer = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "markdown-renderer" }, _attrs))}>`);
      if (__props.data) {
        _push(ssrRenderComponent(_component_ContentRenderer, {
          value: __props.data,
          components
        }, {
          empty: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<p${_scopeId}>No content found.</p>`);
            } else {
              return [
                createVNode("p", null, "No content found.")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/MarkdownRenderer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};

export { _sfc_main as default };
//# sourceMappingURL=MarkdownRenderer-iMk6Yerh.mjs.map
