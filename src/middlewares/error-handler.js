export const errorHandler = async (c, next) => {
  try {
    await next()
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Error:`, {
      message: err.message,
      stack: err.stack,
      path: c.req?.path ?? c.path,
    })

    // Handle different types of errors
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

    // Handle other specific error types here

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
}
