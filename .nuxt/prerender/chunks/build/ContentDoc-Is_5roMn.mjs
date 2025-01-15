import { defineComponent, useSlots, h, useSSRContext, unref, watch } from 'file:///Users/suprateek/Desktop/hero-echo/node_modules/vue/index.mjs';
import { withTrailingSlash, joinURL, withoutTrailingSlash, hasProtocol } from 'file:///Users/suprateek/Desktop/hero-echo/node_modules/ufo/dist/index.mjs';
import _sfc_main$2 from './ContentRenderer-D9s0Lb77.mjs';
import _sfc_main$1 from './ContentQuery-CskZ16-f.mjs';
import { f as useRuntimeConfig, u as useRoute, l as useHead } from './server.mjs';
import './ContentRendererMarkdown-4O677W8d.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/destr/dist/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/scule/dist/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/property-information/index.js';
import './node-BZyc0_pG.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/vue/server-renderer/index.mjs';
import './preview-Jbyp4472.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/cookie-es/dist/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/h3/dist/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/ohash/dist/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/klona/dist/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/ofetch/dist/node.mjs';
import '../nitro/nitro.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/hookable/dist/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/unenv/runtime/fetch/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/defu/dist/defu.mjs';
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
import './asyncData-CXzAbtYr.mjs';
import './query-IHc6BVJO.mjs';

const useContentHead = (_content, to = useRoute()) => {
  const content = unref(_content);
  const config = useRuntimeConfig();
  const refreshHead = (data = content) => {
    var _a;
    if (!to.path || !data) {
      return;
    }
    const head = Object.assign({}, (data == null ? undefined : data.head) || {});
    head.meta = [...head.meta || []];
    head.link = [...head.link || []];
    const title = head.title || (data == null ? undefined : data.title);
    if (title) {
      head.title = title;
      if (!head.meta.some((m) => m.property === "og:title")) {
        head.meta.push({
          property: "og:title",
          content: title
        });
      }
    }
    const host = config.public.content.host;
    if (host) {
      const _url = joinURL(host != null ? host : "/", config.app.baseURL, to.fullPath);
      const url = config.public.content.trailingSlash ? withTrailingSlash(_url) : withoutTrailingSlash(_url);
      if (!head.meta.some((m) => m.property === "og:url")) {
        head.meta.push({
          property: "og:url",
          content: url
        });
      }
      if (!head.link.some((m) => m.rel === "canonical")) {
        head.link.push({
          rel: "canonical",
          href: url
        });
      }
    }
    const description = (head == null ? undefined : head.description) || (data == null ? undefined : data.description);
    if (description && head.meta.filter((m) => m.name === "description").length === 0) {
      head.meta.push({
        name: "description",
        content: description
      });
    }
    if (description && !head.meta.some((m) => m.property === "og:description")) {
      head.meta.push({
        property: "og:description",
        content: description
      });
    }
    const image = (head == null ? undefined : head.image) || (data == null ? undefined : data.image);
    if (image && head.meta.filter((m) => m.property === "og:image").length === 0) {
      if (typeof image === "string") {
        head.meta.push({
          property: "og:image",
          content: host && !hasProtocol(image) ? new URL(joinURL(config.app.baseURL, image), host).href : image
        });
      }
      if (typeof image === "object") {
        const imageKeys = [
          "src",
          "secure_url",
          "type",
          "width",
          "height",
          "alt"
        ];
        for (const key of imageKeys) {
          if (key === "src" && image.src) {
            const isAbsoluteURL = hasProtocol(image.src);
            const imageURL = isAbsoluteURL ? image.src : joinURL(config.app.baseURL, (_a = image.src) != null ? _a : "/");
            head.meta.push({
              property: "og:image",
              content: host && !isAbsoluteURL ? new URL(imageURL, host).href : imageURL
            });
          } else if (image[key]) {
            head.meta.push({
              property: `og:image:${key}`,
              content: image[key]
            });
          }
        }
      }
    }
    {
      useHead(head);
    }
  };
  watch(() => unref(_content), refreshHead, { immediate: true });
};
const ContentDoc = defineComponent({
  name: "ContentDoc",
  props: {
    /**
     * Renderer props
     */
    /**
     * The tag to use for the renderer element if it is used.
     * @default 'div'
     */
    tag: {
      type: String,
      required: false,
      default: "div"
    },
    /**
     * Whether or not to render the excerpt.
     * @default false
     */
    excerpt: {
      type: Boolean,
      default: false
    },
    /**
     * Query props
     */
    /**
     * The path of the content to load from content source.
     * @default useRoute().path
     */
    path: {
      type: String,
      required: false,
      default: undefined
    },
    /**
     * A query builder params object to be passed to <ContentQuery /> component.
     */
    query: {
      type: Object,
      required: false,
      default: undefined
    },
    /**
     * Whether or not to map the document data to the `head` property.
     */
    head: {
      type: Boolean,
      required: false,
      default: undefined
    }
  },
  /**
   * Document empty fallback
   * @slot empty
   */
  /**
   * Document not found fallback
   * @slot not-found
   */
  render(ctx) {
    const { contentHead } = useRuntimeConfig().public.content;
    const slots = useSlots();
    const { tag, excerpt, path, query, head } = ctx;
    const shouldInjectContentHead = head === undefined ? contentHead : head;
    const contentQueryProps = {
      ...query || {},
      path: path || (query == null ? undefined : query.path) || withTrailingSlash(useRoute().path),
      find: "one"
    };
    const emptyNode = (slot, data) => h("pre", null, JSON.stringify({ message: "You should use slots with <ContentDoc>", slot, data }, null, 2));
    return h(
      _sfc_main$1,
      contentQueryProps,
      {
        // Default slot
        default: (slots == null ? undefined : slots.default) ? ({ data, refresh, isPartial }) => {
          var _a;
          if (shouldInjectContentHead) {
            useContentHead(data);
          }
          return (_a = slots.default) == null ? undefined : _a.call(slots, { doc: data, refresh, isPartial, excerpt, ...this.$attrs });
        } : ({ data }) => {
          if (shouldInjectContentHead) {
            useContentHead(data);
          }
          return h(
            _sfc_main$2,
            { value: data, excerpt, tag, ...this.$attrs },
            // Forward local `empty` slots to ContentRenderer if it is used.
            { empty: (bindings) => (slots == null ? undefined : slots.empty) ? slots.empty(bindings) : emptyNode("default", data) }
          );
        },
        // Empty slot
        empty: (bindings) => {
          var _a;
          return ((_a = slots == null ? undefined : slots.empty) == null ? undefined : _a.call(slots, bindings)) || h("p", null, "Document is empty, overwrite this content with #empty slot in <ContentDoc>.");
        },
        // Not Found slot
        "not-found": (bindings) => {
          var _a;
          return ((_a = slots == null ? undefined : slots["not-found"]) == null ? undefined : _a.call(slots, bindings)) || h("p", null, "Document not found, overwrite this content with #not-found slot in <ContentDoc>.");
        }
      }
    );
  }
});
const _sfc_main = ContentDoc;
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/content/dist/runtime/components/ContentDoc.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};

export { _sfc_main as default };
//# sourceMappingURL=ContentDoc-Is_5roMn.mjs.map
