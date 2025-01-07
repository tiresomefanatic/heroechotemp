// server/api/auth/callback.get.ts
import { defineEventHandler, getQuery, sendRedirect } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);

  // Validate required parameters
  if (!query.code || !query.state) {
    return sendRedirect(event, "/?error=missing_params");
  }

  // Redirect back to the frontend with auth parameters
  const redirectUrl = new URL("/", config.public.siteUrl);
  redirectUrl.searchParams.set("code", query.code as string);
  redirectUrl.searchParams.set("state", query.state as string);

  return sendRedirect(event, redirectUrl.toString());
});
