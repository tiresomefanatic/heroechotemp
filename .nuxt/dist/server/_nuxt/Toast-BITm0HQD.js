import { defineComponent, unref, useSSRContext } from "vue";
import { ssrRenderTeleport, ssrRenderList, ssrRenderClass, ssrInterpolate } from "vue/server-renderer";
import { u as useToast } from "./useToast-CuZrFQgt.js";
import { _ as _export_sfc } from "../server.mjs";
import "ofetch";
import "#internal/nuxt/paths";
import "hookable";
import "unctx";
import "h3";
import "@unhead/vue";
import "@unhead/shared";
import "unhead";
import "vue-router";
import "radix3";
import "defu";
import "ufo";
import "@vueuse/core";
import "tailwind-merge";
import "klona";
import "@iconify/vue";
import "destr";
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
          _push2(`<div class="toast-message" data-v-e3d1cab1>${ssrInterpolate(toast.message)}</div><button class="toast-close" aria-label="Close notification" data-v-e3d1cab1> × </button></div>`);
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
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Toast = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e3d1cab1"]]);
export {
  Toast as default
};
//# sourceMappingURL=Toast-BITm0HQD.js.map
