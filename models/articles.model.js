const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT * FROM articles
                WHERE article_id = ${article_id};`
    )
    .then((article) => {
      if (!article.rows.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      } else {
        return article;
      }
    });
};
