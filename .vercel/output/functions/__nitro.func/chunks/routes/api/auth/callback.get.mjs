import { d as defineEventHandler, g as getQuery, s as sendRedirect } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import '@iconify/utils';
import 'consola/core';
import 'node:module';

const callback_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { code, state } = query;
  return sendRedirect(event, `/?code=${code}&state=${state}`);
});

export { callback_get as default };
//# sourceMappingURL=callback.get.mjs.map
