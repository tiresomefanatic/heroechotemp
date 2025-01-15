import { defineComponent, unref, mergeProps, withCtx, createVNode, renderSlot, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderSlot } from "vue/server-renderer";
import { NodeViewWrapper } from "@tiptap/vue-3";
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
  __name: "BaseNodeComponent",
  __ssrInlineRender: true,
  props: {
    deleteNode: { type: Function }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(NodeViewWrapper), mergeProps({ class: "editor-node-wrapper" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="node-controls" data-v-593e23f1${_scopeId}><button class="delete-btn" data-v-593e23f1${_scopeId}>Delete</button></div>`);
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              createVNode("div", { class: "node-controls" }, [
                createVNode("button", {
                  onClick: _ctx.deleteNode,
                  class: "delete-btn"
                }, "Delete", 8, ["onClick"])
              ]),
              renderSlot(_ctx.$slots, "default", {}, void 0, true)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/editor/BaseNodeComponent.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const BaseNodeComponent = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-593e23f1"]]);
export {
  BaseNodeComponent as default
};
//# sourceMappingURL=BaseNodeComponent-C27MGRfg.js.map
