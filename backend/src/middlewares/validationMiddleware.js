// backend/middleware/validationMiddleware.js
const { validationResult } = require("express-validator");

/**
 * Middleware untuk menangani hasil validasi.
 * Jika ada error validasi → kirim response 400.
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }

  next();
};

module.exports = validateRequest;
