import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const level = statusCode >= 500 ? "error" : "warn";

  logger[level](
    {
      err: statusCode >= 500 ? err : undefined,
      statusCode,
      message: err.message,
      method: req.method,
      path: req.originalUrl,
      userId: req.user?._id,
    },
    "request error",
  );

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || "Internal server error",
  });
};
