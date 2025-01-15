import { defineComponent, ref, computed, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import { u as useGithub } from "./useGithub-Cuaqb_Wk.js";
import "./useToast-CuZrFQgt.js";
import { _ as _export_sfc } from "../server.mjs";
import "@octokit/rest";
import "hookable";
import "destr";
import "klona";
import "defu";
import "#internal/nuxt/paths";
import "ofetch";
import "unctx";
import "h3";
import "@unhead/vue";
import "@unhead/shared";
import "unhead";
import "vue-router";
import "radix3";
import "ufo";
import "@vueuse/core";
import "tailwind-merge";
import "@iconify/vue";
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
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CreatePullRequest = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-be1f0ddd"]]);
export {
  CreatePullRequest as default
};
//# sourceMappingURL=CreatePullRequest-BD08MB19.js.map
