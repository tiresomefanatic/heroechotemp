import { useSSRContext, defineComponent, unref } from 'file:///Users/suprateek/Desktop/hero-echo/node_modules/vue/index.mjs';
import { ssrRenderTeleport, ssrRenderList, ssrRenderClass, ssrInterpolate } from 'file:///Users/suprateek/Desktop/hero-echo/node_modules/vue/server-renderer/index.mjs';
import { u as useToast } from './useToast-CuZrFQgt.mjs';
import { _ as _export_sfc } from './server.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/ofetch/dist/node.mjs';
import '../nitro/nitro.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/h3/dist/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/ufo/dist/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/destr/dist/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/hookable/dist/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/unenv/runtime/fetch/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/klona/dist/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/defu/dist/defu.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/scule/dist/index.mjs';
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
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/ohash/dist/index.mjs';
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
  __name: "Toast",
  __ssrInlineRender: true,
  setup(__props) {
    const { toasts, removeToast } = useToast();
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        _push2(`<div class="toast-container" role="status" aria-live="polite" data-v-e3d1cab1><!--[-->`);
        ssrRenderList(unref(toasts), (toast) => {
          _push2(`<div class="${ssrRenderClass([[toast.type, { "has-title": toast.title }], "toast"])}" data-v-e3d1cab1>`);
          if (toast.title) {
            _push2(`<div class="toast-title" data-v-e3d1cab1>${ssrInterpolate(toast.title)}</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="toast-message" data-v-e3d1cab1>${ssrInterpolate(toast.message)}</div><button class="toast-close" aria-label="Close notification" data-v-e3d1cab1> \xD7 </button></div>`);
        });
        _push2(`<!--]--></div>`);
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Toast.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};
const Toast = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e3d1cab1"]]);

export { Toast as default };
//# sourceMappingURL=Toast-BITm0HQD.mjs.map
