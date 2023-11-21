const { selectCommentsByArticleId } = require("../models/comments.model")
const { checkArticleExists } = require("../utils")

exports.getCommentsByArticleId = (req, res, next) => {
const { article_id } = req.params
const commentPromises = [selectCommentsByArticleId(article_id), checkArticleExists(article_id)]


Promise.all(commentPromises)
.then((resolvedPromises) => {
    const comments = resolvedPromises[0]
    res.status(200).send(comments)
})

// selectCommentsByArticleId(article_id).then(({ rows }) => {
//     res.status(200).send(rows)
// })
.catch(next)
}