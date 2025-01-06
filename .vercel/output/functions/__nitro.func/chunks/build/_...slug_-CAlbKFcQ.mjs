import { _ as __nuxt_component_0 } from './client-only-Bwxzq3Sq.mjs';
import { withAsyncContext, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { u as useAsyncData } from './asyncData-CJ5EKNo1.mjs';
import { q as queryContent } from './query-YtloGEka.mjs';
import { _ as _export_sfc } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import '@iconify/utils';
import 'consola/core';
import 'node:module';
import './preview-BkP52PQp.mjs';
import 'unhead';
import '@unhead/shared';
import '@vueuse/core';
import 'tailwind-merge';
import '@iconify/vue';

const _sfc_main = {
  __name: "[...slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const slug = route.params.slug || [];
    const path = Array.isArray(slug) ? slug.join("/") : slug;
    const { data, pending, error, refresh } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      `content-${path}`,
      () => queryContent("design", path).findOne()
    )), __temp = await __temp, __restore(), __temp);
    ref("");
    ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-wrapper" }, _attrs))} data-v-ca98a217>`);
      if (unref(pending)) {
        _push(`<div data-v-ca98a217>Loading...</div>`);
      } else if (unref(error)) {
        _push(`<div data-v-ca98a217>${ssrInterpolate(unref(error))}</div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/design/[...slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ____slug_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ca98a217"]]);

export { ____slug_ as default };
//# sourceMappingURL=_...slug_-CAlbKFcQ.mjs.map
