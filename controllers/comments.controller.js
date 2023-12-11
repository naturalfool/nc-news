const { selectCommentsByArticleId, uploadCommentByArticleId, removeCommentById, updateCommentVotesById } = require("../models/comments.model")
const { checkArticleExists, checkUsernameExists, checkCommentExists } = require("../utils")

exports.getCommentsByArticleId = (req, res, next) => {

const { article_id } = req.params
const commentsPromises = [selectCommentsByArticleId(article_id), checkArticleExists(article_id)]


Promise.all(commentsPromises)
.then((resolvedPromises) => {
    const comments = resolvedPromises[0].rows
    res.status(200).send({comments: comments})
})
.catch(next)
}

exports.postCommentByArticleId = (req, res, next) => {

    const { article_id } = req.params
    const {username, body} = req.body
    const commentPromises = [uploadCommentByArticleId(article_id, username, body), checkUsernameExists(username)]

    Promise.all(commentPromises)
    .then((resolvedPromises) => {
        const comment = resolvedPromises[0]
        res.status(201).send(comment)
    })
    .catch((err) => {
        next(err)
    })
    
}

exports.deleteCommentById = (req, res, next) => {
const { comment_id } = req.params
removeCommentById(comment_id).then(() => {
    res.status(204).send({})
})
.catch((err) => {
    next(err)
})
}

exports.patchCommentVotesById = (req, res, next) => {
const {comment_id} = req.params
const { inc_votes } = req.body

if (typeof inc_votes !== 'number'){
    res.status(400).send({msg: "Bad request"})
} else { 
    const patchPromise = [updateCommentVotesById(comment_id, inc_votes), checkCommentExists(comment_id)]

    Promise.all(patchPromise)
    .then((resolvedPromise) => {
        const patchedComment = resolvedPromise[0].rows[0]
        res.status(200).send(patchedComment)
    })
    .catch((err) => {
        next(err)
    })
    
}
}
