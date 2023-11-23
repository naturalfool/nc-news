const { selectArticleById, fetchAllArticles, updateArticleVotesById } = require("../models/articles.model")
const { checkArticleExists } = require("../utils")


exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params

selectArticleById(article_id).then(({ rows }) => {
    const article = rows[0]
    res.status(200).send({ article })
})
.catch((err) => {
    next(err)
})
}

exports.getAllArticles = (req, res, next) => {

    fetchAllArticles().then(({rows}) => {
        const articles = rows
        res.status(200).send(articles)
    })
}

exports.patchArticleVotesById = (req, res, next) => {
const { article_id } = req.params
const { inc_votes } = req.body
    if (typeof inc_votes !== 'number'){
        res.status(400).send({msg: "Bad request"})
    } else {
        const patchPromise = [updateArticleVotesById(article_id, inc_votes), checkArticleExists(article_id)]

Promise.all(patchPromise)
.then((resolvedPromise) => {
    const patchedArticle = resolvedPromise[0].rows
    res.status(200).send(patchedArticle)
})

    .catch((err) => {
        next(err)
    })
}
}