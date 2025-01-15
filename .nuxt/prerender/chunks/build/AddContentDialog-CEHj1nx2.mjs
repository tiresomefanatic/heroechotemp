import { useSSRContext, defineComponent, ref, mergeProps } from 'file:///Users/suprateek/Desktop/hero-echo/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderStyle, ssrRenderList, ssrInterpolate } from 'file:///Users/suprateek/Desktop/hero-echo/node_modules/vue/server-renderer/index.mjs';
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
  __name: "AddContentDialog",
  __ssrInlineRender: true,
  props: {
    onInsertComponent: { type: Function },
    onInsertSection: { type: Function }
  },
  setup(__props) {
    const isOpen = ref(false);
    const activeTab = ref("components");
    const components = [
      {
        id: "colorwheel",
        name: "Color Wheel",
        description: "Insert a color wheel component"
      }
    ];
    const sections = [
      {
        id: "split-with-image",
        name: "Split with Image",
        description: "Left title, right content with image and text"
      },
      {
        id: "split-with-list",
        name: "Split with List",
        description: "Left title, right content with image and bullet points"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "dialog-wrapper" }, _attrs))} data-v-b53b07ac><button class="add-button" data-v-b53b07ac><span class="plus-icon" data-v-b53b07ac>+</span> Add </button>`);
      if (isOpen.value) {
        _push(`<div class="dialog-overlay" data-v-b53b07ac></div>`);
      } else {
        _push(`<!---->`);
      }
      if (isOpen.value) {
        _push(`<div class="dialog" data-v-b53b07ac><div class="dialog-header" data-v-b53b07ac><h2 class="dialog-title" data-v-b53b07ac>Add Content</h2><button class="close-button" data-v-b53b07ac>\xD7</button></div><div class="tabs" data-v-b53b07ac><div class="tab-list" data-v-b53b07ac><button class="${ssrRenderClass([{ active: activeTab.value === "components" }, "tab-button"])}" data-v-b53b07ac> Components </button><button class="${ssrRenderClass([{ active: activeTab.value === "sections" }, "tab-button"])}" data-v-b53b07ac> Sections </button></div><div style="${ssrRenderStyle(activeTab.value === "components" ? null : { display: "none" })}" class="tab-content" data-v-b53b07ac><div class="content-grid" data-v-b53b07ac><!--[-->`);
        ssrRenderList(components, (component) => {
          _push(`<button class="content-button" data-v-b53b07ac><span class="content-title" data-v-b53b07ac>${ssrInterpolate(component.name)}</span><span class="content-description" data-v-b53b07ac>${ssrInterpolate(component.description)}</span></button>`);
        });
        _push(`<!--]--></div></div><div style="${ssrRenderStyle(activeTab.value === "sections" ? null : { display: "none" })}" class="tab-content" data-v-b53b07ac><div class="content-grid" data-v-b53b07ac><!--[-->`);
        ssrRenderList(sections, (section) => {
          _push(`<button class="content-button" data-v-b53b07ac><span class="content-title" data-v-b53b07ac>${ssrInterpolate(section.name)}</span><span class="content-description" data-v-b53b07ac>${ssrInterpolate(section.description)}</span></button>`);
        });
        _push(`<!--]--></div></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddContentDialog.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};
const AddContentDialog = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b53b07ac"]]);

export { AddContentDialog as default };
//# sourceMappingURL=AddContentDialog-CEHj1nx2.mjs.map
