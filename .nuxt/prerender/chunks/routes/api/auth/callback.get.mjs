import { u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
import { defineEventHandler, getQuery, sendRedirect } from 'file:///Users/suprateek/Desktop/hero-echo/node_modules/h3/dist/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/ufo/dist/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/destr/dist/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/hookable/dist/index.mjs';
import 'file:///Users/suprateek/Desktop/hero-echo/node_modules/ofetch/dist/node.mjs';
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

const callback_get = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  console.log("Received callback with query:", query);
  if (!query.code || !query.state) {
    console.error("Missing required parameters:", { code: !!query.code, state: !!query.state });
    return sendRedirect(event, "/?error=missing_params");
  }
  try {
    const baseUrl = config.public.siteUrl || "http://localhost:3009";
    console.log("Base URL:", baseUrl);
    const redirectUrl = new URL("/", baseUrl);
    redirectUrl.searchParams.set("code", query.code);
    redirectUrl.searchParams.set("state", query.state);
    const finalRedirectUrl = redirectUrl.toString();
    console.log("Redirecting to:", finalRedirectUrl);
    return sendRedirect(event, finalRedirectUrl);
  } catch (error) {
    console.error("Error in callback handler:", error);
    return sendRedirect(event, "/?error=callback_error");
  }
});

export { callback_get as default };
//# sourceMappingURL=callback.get.mjs.map
