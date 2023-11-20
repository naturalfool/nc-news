const JSONendpoints = require("../endpoints.json")

exports.getAPIEndpoints = (req, res, next) => {
res.status(200).send(JSONendpoints)
}