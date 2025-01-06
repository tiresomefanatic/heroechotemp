import { defineEventHandler, getQuery, sendRedirect } from 'h3'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { code, state } = query

  // Redirect back to the frontend with the code and state
  return sendRedirect(event, `/?code=${code}&state=${state}`)
})
