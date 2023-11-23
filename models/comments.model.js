const db = require("../db/connection")

exports.selectCommentsByArticleId = (article_id) => {

    return db.query(`SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC`, [article_id])
    
}

exports.uploadCommentByArticleId = (article_id, username, body) => {

   if (typeof body !== 'string'){
        return Promise.reject({status: 400, msg: "Bad request"})
    }
    else {

    return db.query(`INSERT INTO comments(author, article_id, body)
    VALUES($1, $2, $3) RETURNING*;`, [username, article_id, body ])
    
    }

}

exports.removeCommentById = (comment_id) => {

    return db.query(`DELETE FROM comments
    WHERE comment_id = $1 RETURNING*;`, [comment_id]).then(({rows}) => {
        if (!rows.length){
            return Promise.reject({status: 404, msg: "Comment not found"})
        }
    })
}
