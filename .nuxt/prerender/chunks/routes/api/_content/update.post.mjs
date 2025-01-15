import { defineEventHandler, readBody, createError } from 'file:///Users/suprateek/Desktop/hero-echo/node_modules/h3/dist/index.mjs';
import { mkdir, writeFile } from 'fs/promises';
import { join, dirname } from 'path';

const update_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id, content } = body;
  const contentDir = join(process.cwd(), "content");
  const filePath = join(contentDir, `${id}.md`);
  try {
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, content);
    return { success: true };
  } catch (error) {
    console.error("Error writing file:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to save content"
    });
  }
});

export { update_post as default };
//# sourceMappingURL=update.post.mjs.map
