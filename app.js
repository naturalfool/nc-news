const express = require("express")
const { getAllTopics } = require("./controllers/topics.controller")
const { getAPIEndpoints } = require("./controllers/api.controller")
const { getArticleById, getAllArticles, patchArticleVotesById } = require("./controllers/articles.controller");
const { handlePostgresErrors, handleCustomErrors, handleServerErrors } = require("./errors");
const { getCommentsByArticleId, postCommentByArticleId, deleteCommentById, patchCommentVotesById } = require("./controllers/comments.controller")
const { getUsers, getUserByUsername } = require("./controllers/users.controller")
// const cors = require('cors')

const app = express();
// app.use(cors());
app.use(express.json());


app.get("/api/topics", getAllTopics)
app.get("/api", getAPIEndpoints)
app.get("/api/articles", getAllArticles)
app.get("/api/articles/:article_id", getArticleById)
app.get("/api/articles/:article_id/comments", getCommentsByArticleId)
app.get("/api/users", getUsers)
app.get("/api/users/:username", getUserByUsername)

app.post("/api/articles/:article_id/comments", postCommentByArticleId)

app.patch("/api/articles/:article_id", patchArticleVotesById)
app.patch("/api/comments/:comment_id", patchCommentVotesById)

app.delete("/api/comments/:comment_id", deleteCommentById)

app.all("/*", (req, res) => {
res.status(404).send({ msg: "path not found" })
})

app.use(handlePostgresErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)

module.exports = app