const { selectCommentsByArticleId, uploadCommentByArticleId } = require("../models/comments.model")
const { checkArticleExists } = require("../utils")

exports.getCommentsByArticleId = (req, res, next) => {

const { article_id } = req.params
const commentPromises = [selectCommentsByArticleId(article_id), checkArticleExists(article_id)]


Promise.all(commentPromises)
.then((resolvedPromises) => {
    const comments = resolvedPromises[0]
    res.status(200).send({comments: comments})
})
.catch(next)
}

exports.postCommentByArticleId = (req, res, next) => {

    const { article_id } = req.params
    const {username, body} = req.body
    
uploadCommentByArticleId(article_id, username, body).then(({ rows }) => {
res.status(201).send(rows[0])
})
.catch(next)
}