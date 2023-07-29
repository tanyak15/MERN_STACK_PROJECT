const checkAllProvided = (...variables) => {
  return variables.every((variable) => {
    if (!variable || variable?.length === 0) {
      return false;
    }
    return true;
  });
};
module.exports = checkAllProvided;
