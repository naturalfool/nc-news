const express = require("express")
const { getAllTopics } = require("./controllers/topics.controller")
const { getAPIEndpoints } = require("./controllers/api.controller")
const { getArticleById } = require("./controllers/articles.controller");
const { handlePostgresErrors, handleCustomErrors, handleServerErrors } = require("./errors");

const app = express();
app.use(express.json());

app.get("/api/topics", getAllTopics)
app.get("/api", getAPIEndpoints)
app.get("/api/articles/:article_id", getArticleById)
app.get("/api/articles/word_instead_of_number", getArticleById)


app.use("/*", (req, res) => {
res.status(404).send({ msg: "path not found" })
})

app.use(handlePostgresErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)

module.exports = app