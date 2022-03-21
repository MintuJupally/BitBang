const requestLogger = (req, res, next) => {
  console.log("request method: " + req.method);
  console.log("request path: " + req.path);
  console.log("request body: ");
  console.log(req.body);
  console.log("--------------------------------------------------");
  next();
};

module.exports = requestLogger;
