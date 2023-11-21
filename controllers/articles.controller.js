const { selectArticleById } = require("../models/articles.model")


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