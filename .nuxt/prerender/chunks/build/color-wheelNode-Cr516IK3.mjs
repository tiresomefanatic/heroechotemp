import { defineComponent, resolveComponent, mergeProps, withCtx, createVNode, useSSRContext } from 'file:///Users/suprateek/Desktop/hero-echo/node_modules/vue/index.mjs';
import { ssrRenderComponent } from 'file:///Users/suprateek/Desktop/hero-echo/node_modules/vue/server-renderer/index.mjs';
import BaseNodeComponent from './BaseNodeComponent-B13FR4uU.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/@tiptap/vue-3/dist/index.js';
import './server.mjs';
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
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/unhead/dist/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/@unhead/shared/dist/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/vue-router/dist/vue-router.node.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/@vueuse/core/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/tailwind-merge/dist/bundle-mjs.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/@iconify/vue/dist/iconify.mjs';

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
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};

export { _sfc_main as default };
//# sourceMappingURL=color-wheelNode-Cr516IK3.mjs.map
