import { u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
import { defineEventHandler, sendRedirect, getQuery, createError, setCookie } from 'file:///Users/suprateek/Desktop/hero-echo/node_modules/h3/dist/index.mjs';
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

const _____ = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const path = event.path;
  console.log("Auth handler called with path:", path);
  if (path.endsWith("/api/auth/login")) {
    console.log("Handling login...");
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${config.github.clientId}&scope=repo user&redirect_uri=${encodeURIComponent(
      ("http://localhost:3000") + "/api/auth/callback"
    )}`;
    return sendRedirect(event, authUrl);
  }
  if (path.includes("/api/auth/callback")) {
    console.log("Handling callback...");
    const query = getQuery(event);
    console.log("Callback query:", query);
    const code = query.code;
    if (!code) {
      console.error("No code provided in callback");
      throw createError({
        statusCode: 400,
        message: "No code provided"
      });
    }
    try {
      console.log("Exchanging code for token...");
      const tokenResponse = await fetch(
        "https://github.com/login/oauth/access_token",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            client_id: config.github.clientId,
            client_secret: config.github.clientSecret,
            code
          })
        }
      );
      const tokenData = await tokenResponse.json();
      console.log("Token response received:", tokenData.access_token ? "Token present" : "No token");
      if (!tokenData.access_token) {
        throw createError({
          statusCode: 401,
          message: "Failed to get access token"
        });
      }
      const baseUrl = false ? "/heroechotemp" : "";
      return sendRedirect(event, `${baseUrl}/?token=${tokenData.access_token}`);
    } catch (error) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || "Failed to authenticate with GitHub"
      });
    }
  }
  if (path.endsWith("/api/auth/logout")) {
    setCookie(event, "github_token", "", {
      maxAge: 0,
      httpOnly: true
    });
    return sendRedirect(event, "/");
  }
  throw createError({
    statusCode: 404,
    message: "Not found"
  });
});

export { _____ as default };
//# sourceMappingURL=_..._.mjs.map
