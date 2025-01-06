import { d as defineEventHandler, r as readBody, c as createError } from '../../nitro/nitro.mjs';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import '@iconify/utils';
import 'consola/core';
import 'node:module';

const rawContent_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { path, content } = body;
  if (!path || !content) {
    throw createError({
      statusCode: 400,
      message: "Path and content are required"
    });
  }
  try {
    const fullPath = resolve(process.cwd(), "content", path);
    writeFileSync(fullPath, content, "utf-8");
    return { success: true };
  } catch (error) {
    console.error("Error writing file:", error);
    throw createError({
      statusCode: 500,
      message: "Error writing file"
    });
  }
});

export { rawContent_post as default };
//# sourceMappingURL=raw-content.post.mjs.map
