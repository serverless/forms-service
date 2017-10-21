/* validate require fields exist in request body */
module.exports = function validateBody(payload, validFields) {
  if (!Array.isArray(validFields)) {
    throw new Error(`validFields must be an array of keys`);
  }

  for (const requiredParam of validFields) {
    if (!payload[requiredParam]) {
      throw new Error(`Missing ${requiredParam} parameter`);
    }
  }
}
