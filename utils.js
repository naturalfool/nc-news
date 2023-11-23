const db = require("./db/connection")

exports.checkArticleExists = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
        if (!rows.length){
            return Promise.reject({status: 404, msg: "Article not found"})
        }
    })
}

exports.checkUsernameExists = (username) => {
    return db.query(`SELECT * FROM comments WHERE author = $1;`, [username])
    .then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({status: 404, msg: "Invalid username"})
        }
    })
}

exports.checkTopicExists = (topic) => {
    return db.query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then(({ rows }) => {
        if (!rows.length){
            return Promise.reject({status: 404, msg: "Topic not found"})
        }
    })
}