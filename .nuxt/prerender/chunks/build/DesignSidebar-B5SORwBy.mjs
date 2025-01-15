import { _ as _export_sfc, a as __nuxt_component_0 } from './server.mjs';
import { ref, watch, mergeProps, withCtx, createTextVNode, useSSRContext } from 'file:///Users/suprateek/Desktop/hero-echo/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent } from 'file:///Users/suprateek/Desktop/hero-echo/node_modules/vue/server-renderer/index.mjs';
import { useRoute } from 'file:///Users/suprateek/Desktop/hero-echo/node_modules/vue-router/dist/vue-router.node.mjs';
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
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/@vueuse/core/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/tailwind-merge/dist/bundle-mjs.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/@iconify/vue/dist/iconify.mjs';

const _sfc_main = {
  __name: "DesignSidebar",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const isCollapsed = ref({
      foundation: false,
      digital: true,
      product: true,
      sound: true,
      space: true
    });
    watch(
      () => route.path,
      (newPath) => {
        if (newPath.includes("/design/foundation/")) {
          isCollapsed.value.foundation = false;
        }
        if (newPath.includes("/design/product/")) {
          isCollapsed.value.product = false;
        }
        if (newPath.includes("/design/space/")) {
          isCollapsed.value.space = false;
        }
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<aside${ssrRenderAttrs(mergeProps({ class: "design-sidebar" }, _attrs))} data-v-0c85d7c8><nav class="design-nav" data-v-0c85d7c8><div class="nav-content" data-v-0c85d7c8><div class="nav-group" data-v-0c85d7c8><div class="nav-group-header main-item" data-v-0c85d7c8> Foundation <span class="${ssrRenderClass([{ rotated: !isCollapsed.value.foundation }, "chevron"])}" data-v-0c85d7c8>\u203A</span></div><div class="${ssrRenderClass([{ collapsed: isCollapsed.value.foundation }, "nav-group-content"])}" data-v-0c85d7c8>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/design/foundation/logo",
        class: "nav-item sub-item"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Logo`);
          } else {
            return [
              createTextVNode("Logo")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/design/foundation/color",
        class: "nav-item sub-item"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Color`);
          } else {
            return [
              createTextVNode("Color")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/design/foundation/typography",
        class: "nav-item sub-item"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Typography`);
          } else {
            return [
              createTextVNode("Typography")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="nav-item sub-item locked" data-v-0c85d7c8> Illustration <span class="lock-icon" data-v-0c85d7c8>\u{1F512}</span></div><div class="nav-item sub-item locked" data-v-0c85d7c8> Icons <span class="lock-icon" data-v-0c85d7c8>\u{1F512}</span></div><div class="nav-item sub-item locked" data-v-0c85d7c8> Layout <span class="lock-icon" data-v-0c85d7c8>\u{1F512}</span></div><div class="nav-item sub-item locked" data-v-0c85d7c8> Imagery <span class="lock-icon" data-v-0c85d7c8>\u{1F512}</span></div><div class="nav-item sub-item locked" data-v-0c85d7c8> Animation <span class="lock-icon" data-v-0c85d7c8>\u{1F512}</span></div><div class="nav-item sub-item locked" data-v-0c85d7c8> Applications <span class="lock-icon" data-v-0c85d7c8>\u{1F512}</span></div></div></div><div class="nav-group" data-v-0c85d7c8><div class="nav-group-header main-item locked" data-v-0c85d7c8> Digital <span class="lock-icon" data-v-0c85d7c8>\u{1F512}</span></div></div><div class="nav-group" data-v-0c85d7c8><div class="nav-group-header main-item locked" data-v-0c85d7c8> Sound <span class="lock-icon" data-v-0c85d7c8>\u{1F512}</span></div></div><div class="nav-group" data-v-0c85d7c8><div class="nav-group-header main-item" data-v-0c85d7c8> Product <span class="${ssrRenderClass([{ rotated: !isCollapsed.value.product }, "chevron"])}" data-v-0c85d7c8>\u203A</span></div><div class="${ssrRenderClass([{ collapsed: isCollapsed.value.product }, "nav-group-content"])}" data-v-0c85d7c8>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/design/product/creative-spectrum",
        class: "nav-item sub-item"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Creative Spectrum`);
          } else {
            return [
              createTextVNode("Creative Spectrum")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/design/product/case-studies",
        class: "nav-item sub-item"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Case Studies`);
          } else {
            return [
              createTextVNode("Case Studies")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="nav-group" data-v-0c85d7c8><div class="nav-group-header main-item" data-v-0c85d7c8> Space <span class="${ssrRenderClass([{ rotated: !isCollapsed.value.space }, "chevron"])}" data-v-0c85d7c8>\u203A</span></div><div class="${ssrRenderClass([{ collapsed: isCollapsed.value.space }, "nav-group-content"])}" data-v-0c85d7c8>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/design/space/introduction",
        class: "nav-item sub-item"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Introduction`);
          } else {
            return [
              createTextVNode("Introduction")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/design/space/mood",
        class: "nav-item sub-item"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Mood`);
          } else {
            return [
              createTextVNode("Mood")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/design/space/form",
        class: "nav-item sub-item"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Form`);
          } else {
            return [
              createTextVNode("Form")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></nav></aside>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DesignSidebar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};
const DesignSidebar = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0c85d7c8"]]);

export { DesignSidebar as default };
//# sourceMappingURL=DesignSidebar-B5SORwBy.mjs.map
