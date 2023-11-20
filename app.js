const express = require("express")
const { getAllTopics } = require("./controllers/topics.controller")
const { getAPIEndpoints } = require("./controllers/api.controller")

const app = express();
app.use(express.json());

app.get("/api/topics", getAllTopics)
app.get("/api", getAPIEndpoints)

app.get("/invalid_path", (req, res) => {
res.status(404).send({ msg: "path not found" })
})


module.exports = app