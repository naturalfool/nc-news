const db = require("../db/connection")

exports.selectCommentsByArticleId = (article_id) => {

    return db.query(`SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC`, [article_id])
    
}

exports.uploadCommentByArticleId = (article_id, username, body) => {

    return db.query(`INSERT INTO comments(author, article_id, body)
    VALUES($1, $2, $3) RETURNING*;`, [username, article_id, body ])

}
