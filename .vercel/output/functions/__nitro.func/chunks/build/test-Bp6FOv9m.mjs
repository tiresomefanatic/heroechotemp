import { _ as __nuxt_component_0 } from './client-only-Bwxzq3Sq.mjs';
import { ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import '@iconify/utils';
import 'consola/core';
import 'node:module';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import '@vueuse/core';
import 'tailwind-merge';
import '@iconify/vue';

const _sfc_main = {
  __name: "test",
  __ssrInlineRender: true,
  setup(__props) {
    ref("# Test Content\n\nThis is a test editor.");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-wrapper" }, _attrs))} data-v-846972e2><h1 data-v-846972e2>Test Editor</h1>`);
      if (_ctx.pending) {
        _push(`<div data-v-846972e2>Loading...</div>`);
      } else if (_ctx.error) {
        _push(`<div data-v-846972e2>${ssrInterpolate(_ctx.error)}</div>`);
      } else {
        _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/test.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const test = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-846972e2"]]);

export { test as default };
//# sourceMappingURL=test-Bp6FOv9m.mjs.map
