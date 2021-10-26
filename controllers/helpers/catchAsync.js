//this function returns a wrapper to call async controller functions which catches errors
//used to remove try/catch mess
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;
