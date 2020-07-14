// Due to material ui lack of input validation props
// we add this simple util for validating fields

exports.validate = (input, pattern, type) => {
  if (typeof input !== type) {
    return false;
  }
  if (pattern && !pattern.test(input)) {
    return false;
  }
  return true;
};
