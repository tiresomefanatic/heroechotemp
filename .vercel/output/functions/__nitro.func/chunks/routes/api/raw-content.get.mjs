import { d as defineEventHandler, g as getQuery, c as createError } from '../../nitro/nitro.mjs';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import '@iconify/utils';
import 'consola/core';
import 'node:module';

const rawContent_get = defineEventHandler((event) => {
  const query = getQuery(event);
  const filePath = query.path;
  if (!filePath) {
    throw createError({
      statusCode: 400,
      message: "Path parameter is required"
    });
  }
  try {
    const fullPath = resolve(process.cwd(), "content", filePath);
    const content = readFileSync(fullPath, "utf-8");
    return { content };
  } catch (error) {
    console.error("Error reading file:", error);
    throw createError({
      statusCode: 500,
      message: "Error reading file"
    });
  }
});

export { rawContent_get as default };
//# sourceMappingURL=raw-content.get.mjs.map
