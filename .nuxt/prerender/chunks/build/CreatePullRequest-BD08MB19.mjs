import { useSSRContext, defineComponent, ref, computed, mergeProps } from 'file:///Users/suprateek/Desktop/hero-echo/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'file:///Users/suprateek/Desktop/hero-echo/node_modules/vue/server-renderer/index.mjs';
import { u as useGithub } from './useGithub-Cuaqb_Wk.mjs';
import { _ as _export_sfc } from './server.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/@octokit/rest/dist-src/index.js';
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
  __name: "CreatePullRequest",
  __ssrInlineRender: true,
  props: {
    branches: {},
    currentBranch: {}
  },
  emits: ["created", "cancel"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    useGithub();
    const loading = ref(false);
    const baseBranch = ref("main");
    const headBranch = ref("");
    const title = ref("");
    const description = ref("");
    const showValidation = ref(false);
    const isValid = computed(() => {
      return baseBranch.value && headBranch.value && title.value.trim() && baseBranch.value !== headBranch.value;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "create-pr-form" }, _attrs))} data-v-be1f0ddd><h3 class="form-title" data-v-be1f0ddd>Create Pull Request</h3><div class="form-group" data-v-be1f0ddd><label for="base" data-v-be1f0ddd>Base Branch</label><select id="base" class="form-select"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-be1f0ddd><option value="" data-v-be1f0ddd${ssrIncludeBooleanAttr(Array.isArray(baseBranch.value) ? ssrLooseContain(baseBranch.value, "") : ssrLooseEqual(baseBranch.value, "")) ? " selected" : ""}>Select base branch</option><!--[-->`);
      ssrRenderList(props.branches, (branch) => {
        _push(`<option${ssrRenderAttr("value", branch)} data-v-be1f0ddd${ssrIncludeBooleanAttr(Array.isArray(baseBranch.value) ? ssrLooseContain(baseBranch.value, branch) : ssrLooseEqual(baseBranch.value, branch)) ? " selected" : ""}>${ssrInterpolate(branch)}</option>`);
      });
      _push(`<!--]--></select>`);
      if (!baseBranch.value) {
        _push(`<span class="helper-text" data-v-be1f0ddd>This is the branch where changes will be merged into</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="form-group" data-v-be1f0ddd><label for="head" data-v-be1f0ddd>Source Branch</label><select id="head" class="form-select"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-be1f0ddd><option value="" data-v-be1f0ddd${ssrIncludeBooleanAttr(Array.isArray(headBranch.value) ? ssrLooseContain(headBranch.value, "") : ssrLooseEqual(headBranch.value, "")) ? " selected" : ""}>Select source branch</option><!--[-->`);
      ssrRenderList(props.branches, (branch) => {
        _push(`<option${ssrRenderAttr("value", branch)} data-v-be1f0ddd${ssrIncludeBooleanAttr(Array.isArray(headBranch.value) ? ssrLooseContain(headBranch.value, branch) : ssrLooseEqual(headBranch.value, branch)) ? " selected" : ""}>${ssrInterpolate(branch)}</option>`);
      });
      _push(`<!--]--></select>`);
      if (!headBranch.value) {
        _push(`<span class="helper-text" data-v-be1f0ddd>This is the branch containing your changes</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="form-group" data-v-be1f0ddd><label for="title" data-v-be1f0ddd>Title</label><input id="title"${ssrRenderAttr("value", title.value)} type="text" class="form-input" placeholder="Enter PR title"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-be1f0ddd>`);
      if (showValidation.value && !title.value.trim()) {
        _push(`<span class="validation-error" data-v-be1f0ddd> Title is required </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="form-group" data-v-be1f0ddd><label for="description" data-v-be1f0ddd>Description</label><textarea id="description" class="form-textarea" placeholder="Enter PR description" rows="4"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-be1f0ddd>${ssrInterpolate(description.value)}</textarea></div>`);
      if (showValidation.value && !isValid.value) {
        _push(`<div class="validation-summary" data-v-be1f0ddd><p data-v-be1f0ddd>Please fix the following issues:</p><ul data-v-be1f0ddd>`);
        if (!baseBranch.value) {
          _push(`<li data-v-be1f0ddd>Select a base branch</li>`);
        } else {
          _push(`<!---->`);
        }
        if (!headBranch.value) {
          _push(`<li data-v-be1f0ddd>Select a source branch</li>`);
        } else {
          _push(`<!---->`);
        }
        if (baseBranch.value === headBranch.value && baseBranch.value) {
          _push(`<li data-v-be1f0ddd> Base and source branches must be different </li>`);
        } else {
          _push(`<!---->`);
        }
        if (!title.value.trim()) {
          _push(`<li data-v-be1f0ddd>Enter a title for the pull request</li>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</ul></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="form-actions" data-v-be1f0ddd><button class="cancel-button"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-be1f0ddd> Cancel </button><button class="submit-button"${ssrIncludeBooleanAttr(!isValid.value || loading.value) ? " disabled" : ""} data-v-be1f0ddd>${ssrInterpolate(loading.value ? "Creating..." : "Create Pull Request")}</button></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CreatePullRequest.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};
const CreatePullRequest = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-be1f0ddd"]]);

export { CreatePullRequest as default };
//# sourceMappingURL=CreatePullRequest-BD08MB19.mjs.map
