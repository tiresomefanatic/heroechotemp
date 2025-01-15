import { defineComponent, resolveComponent, mergeProps, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import BaseNodeComponent from "./BaseNodeComponent-B13FR4uU.js";
import "@tiptap/vue-3";
import "../server.mjs";
import "ofetch";
import "#internal/nuxt/paths";
import "hookable";
import "unctx";
import "h3";
import "unhead";
import "@unhead/shared";
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
  __name: "color-wheelNode",
  __ssrInlineRender: true,
  props: {
    node: {
      type: Object,
      required: true
    },
    updateAttributes: {
      type: Function,
      required: true
    },
    deleteNode: {
      type: Function,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const updateSection = (section, color) => {
      props.updateAttributes({
        [`${section}Color`]: color
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ContentColorWheel = resolveComponent("ContentColorWheel");
      _push(ssrRenderComponent(BaseNodeComponent, mergeProps({ deleteNode: __props.deleteNode }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_ContentColorWheel, {
              sportColor: __props.node.attrs.sportColor,
              cruiserColor: __props.node.attrs.cruiserColor,
              urbanColor: __props.node.attrs.urbanColor,
              offroadColor: __props.node.attrs.offroadColor,
              "onClick:section": updateSection
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_ContentColorWheel, {
                sportColor: __props.node.attrs.sportColor,
                cruiserColor: __props.node.attrs.cruiserColor,
                urbanColor: __props.node.attrs.urbanColor,
                offroadColor: __props.node.attrs.offroadColor,
                "onClick:section": updateSection
              }, null, 8, ["sportColor", "cruiserColor", "urbanColor", "offroadColor"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/editor/color-wheelNode.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=color-wheelNode-Cr516IK3.js.map
