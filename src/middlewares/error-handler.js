import { HTTPException } from 'hono/http-exception'

export const errorHandler = async (err, c) => {
  console.error(`[${new Date().toISOString()}] Error:`, {
    message: err.message,
    stack: err.stack,
    path: c.req.url,
  })

  if (err instanceof HTTPException) {
    return c.json(
      {
        status: err.status,
        message: err.message,
      },
      err.status
    )
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return c.json(
      {
        status: 400,
        message: 'Validation Error',
        errors: err.details,
      },
      400
    )
  }

  // Default error response
  const status = err.status || 500
  return c.json(
    {
      status,
      message: err.message || 'Internal Server Error',
    },
    status
  )
}
