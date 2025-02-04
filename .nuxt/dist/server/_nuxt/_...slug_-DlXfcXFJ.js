import { defineComponent, ref, provide, createElementBlock, computed, withAsyncContext, watch, mergeProps, useSSRContext } from "vue";
import "hookable";
import "./server-placeholder-BFzIFO-1.js";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { useRoute } from "vue-router";
import { u as useGithub } from "./useGithub-Bwy_ZpeV.js";
import { u as useToast } from "./useToast-CuZrFQgt.js";
import { b as useNuxtApp, _ as _export_sfc } from "../server.mjs";
import { u as useAsyncData } from "./asyncData-OL5apFi5.js";
import "destr";
import "klona";
import "defu";
import "#internal/nuxt/paths";
import { q as queryContent } from "./query-CR2iDEUU.js";
import "@octokit/rest";
import "ofetch";
import "unctx";
import "h3";
import "unhead";
import "@unhead/shared";
import "radix3";
import "ufo";
import "@vueuse/core";
import "tailwind-merge";
import "@iconify/vue";
import "ohash";
import "./preview-B1t3pASZ.js";
import "cookie-es";
const clientOnlySymbol = Symbol.for("nuxt:client-only");
const __nuxt_component_0 = defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  setup(_, { slots, attrs }) {
    const mounted = ref(false);
    provide(clientOnlySymbol, true);
    return (props) => {
      var _a;
      if (mounted.value) {
        return (_a = slots.default) == null ? void 0 : _a.call(slots);
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return slot();
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[...slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { getRawContent, saveFileContent, isLoggedIn, currentBranch } = useGithub();
    const { showToast } = useToast();
    const loading = ref(false);
    const isEditing = ref(false);
    const editorContent = ref("");
    const contentLastModified = ref(null);
    const route = useRoute();
    const slug = route.params.slug || [];
    const path = Array.isArray(slug) ? slug.join("/") : slug;
    computed(() => path !== "");
    computed(() => `${path}-${Date.now()}`);
    const { data } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      `content-${path}`,
      () => {
        if (!path) {
          return queryContent().where({ _path: "/" }).findOne();
        }
        return queryContent().where({ _path: `/${path}` }).findOne();
      },
      {
        immediate: true,
        server: true
      }
    )), __temp = await __temp, __restore(), __temp);
    const contentPath = computed(() => {
      if (!path) return "content/index.md";
      return `content/${path}.md`;
    });
    const checkContentFreshness = async () => {
      var _a;
      try {
        const response = await fetch(
          `https://api.github.com/repos/tiresomefanatic/heroechotemp/commits?path=${contentPath.value}&sha=${currentBranch.value}`,
          { headers: { Accept: "application/vnd.github.v3+json" } }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch commit info");
        }
        const commits = await response.json();
        const latestCommitSha = (_a = commits[0]) == null ? void 0 : _a.sha;
        if (latestCommitSha !== contentLastModified.value) {
          console.log("New commit detected, refreshing content...");
          contentLastModified.value = latestCommitSha;
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error checking content freshness:", error);
        return true;
      }
    };
    const loadContent = async (force = false) => {
      loading.value = true;
      try {
        const needsRefresh = force || await checkContentFreshness();
        if (needsRefresh) {
          console.log(`Fetching fresh content at ${(/* @__PURE__ */ new Date()).toISOString()}`);
          console.log(`Branch: ${currentBranch.value}, Path: ${contentPath.value}`);
          const content = await getRawContent(
            "tiresomefanatic",
            "heroechotemp",
            contentPath.value,
            currentBranch.value
          );
          console.log("Raw content fetched:", {
            length: (content == null ? void 0 : content.length) || 0,
            preview: content == null ? void 0 : content.substring(0, 500)
          });
          editorContent.value = content;
          if (false) ;
          console.log("Content loaded and refreshed successfully");
        }
      } catch (error) {
        console.error("Content loading error:", error);
        console.error("Full error details:", {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        showToast({
          title: "Error",
          message: `Failed to load content from branch: ${currentBranch.value}`,
          type: "error"
        });
      } finally {
        loading.value = false;
      }
    };
    watch(isEditing, async (newValue, oldValue) => {
      if (newValue && !oldValue) {
        await loadContent(true);
      }
    });
    watch(currentBranch, async (newBranch, oldBranch) => {
      if (newBranch !== oldBranch) {
        console.log(
          `Branch changed from ${oldBranch} to ${newBranch}, reloading content...`
        );
        await loadContent(true);
      }
    });
    watch(contentPath, async (newPath, oldPath) => {
      if (newPath !== oldPath) {
        await loadContent(true);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-wrapper" }, _attrs))} data-v-639f0781>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[...slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ____slug_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-639f0781"]]);
export {
  ____slug_ as default
};
//# sourceMappingURL=_...slug_-DlXfcXFJ.js.map
