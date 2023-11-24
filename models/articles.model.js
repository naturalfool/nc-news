const db = require("../db/connection");

// exports.selectArticleById = (article_id) => {
//   return db
//     .query(
//       `SELECT * FROM articles
//                 WHERE article_id = $1;`,
//       [article_id]
//     )
//     .then((article) => {
//       if (article.rows.length === 0) {
//         return Promise.reject({ status: 404, msg: "Article not found" });
//       } else {
//         return article;
//       }
//     });
// };
exports.selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.author, title, articles.article_id, articles.body, topic, articles.created_at, articles.votes, article_img_url, CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.author, articles.title, articles.article_id
      ORDER BY articles.created_at DESC`, [article_id]
    )
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      } else {
        return article;
      }
    });
};
exports.fetchAllArticles = (topic, order) => {
  let queryStr = `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url`
let queryValues = []

  if (topic && !order){
    queryValues.push(topic)
  queryStr += ` FROM articles
  WHERE topic = $1`
  return db.query(queryStr, queryValues)
} else if (!topic && !order) {
  queryStr += `, CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  GROUP BY articles.author, articles.title, articles.article_id
  ORDER BY articles.created_at DESC`
  return db.query(queryStr)
}
if (order){
queryValues.push(order)
  queryStr += `, CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  GROUP BY articles.author, articles.title, articles.article_id
  ORDER BY articles.created_at ASC`
  return db.query(queryStr)

} else if (topic && order){
  queryValues.push(topic)
  queryStr += ` FROM articles
  WHERE topic = $1
  GROUP BY articles.author, articles.title, articles.article_id
  ORDER BY articles.created_at ASC`
  return db.query(queryStr, queryValues)
}


  // return db.query(queryStr, queryValues)
   
};

exports.updateArticleVotesById = (article_id, inc_votes) => {

    return db.query(
      `UPDATE articles
SET votes = votes + $1
WHERE article_id = $2 RETURNING*;`,
      [inc_votes, article_id]
    );
  }

