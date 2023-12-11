const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const connection = require("../db/connection");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  connection.end();
});

describe("/api/topics", () => {
  test("GET: 200 should return an array of topics objects containing the correct keys", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;
        expect(Array.isArray(topics)).toBe(true);
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic.hasOwnProperty("slug")).toBe(true);
          expect(topic.hasOwnProperty("description")).toBe(true);
        });
      });
  });
  test("404: responds with an correct error message if the path is invalid", () => {
    return request(app)
      .get("/invalid_path")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
      });
  });
});

describe("/api", () => {
  test("GET 200: responds with an object describing all the available endpoints on the API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const endpointKeys = Object.keys(body);
        expect(endpointKeys[0]).toBe("GET /api");
        expect(endpointKeys[1]).toBe("GET /api/topics");
        expect(endpointKeys[2]).toBe("GET /api/articles");
        const endpoints = [
          body["GET /api"],
          body["GET /api/topics"],
          body["GET /api/articles"],
        ];
        endpoints.forEach((endpoint) => {
          expect(endpoint.hasOwnProperty("description")).toBe(true);
        });
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET: 200 should return a single article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const article = body;
        expect(typeof article).toBe("object");
        expect(Array.isArray(article)).toBe(false);
      });
  });
  test("200: article has correct properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const article = body;
        expect(article.hasOwnProperty("author")).toBe(true);
        expect(article.hasOwnProperty("title")).toBe(true);
        expect(article.hasOwnProperty("article_id")).toBe(true);
        expect(article.hasOwnProperty("body")).toBe(true);
        expect(article.hasOwnProperty("topic")).toBe(true);
        expect(article.hasOwnProperty("created_at")).toBe(true);
        expect(article.hasOwnProperty("votes")).toBe(true);
        expect(article.hasOwnProperty("article_img_url")).toBe(true);
      });
  });
  test("GET 200: article object also has a comment_count property that is equal to the amount of comments on that article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.hasOwnProperty("comment_count"));
        expect(body.comment_count).toBe(11);
      });
  });
  test("400: returns approriate error message if given an article id that isnt an integer", () => {
    return request(app)
      .get("/api/articles/word_instead_of_number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: returns appropriate error message if given an article id that is a number, but doesnt exist", () => {
    return request(app)
      .get("/api/articles/100")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});
describe("articles queries, sort_by & order", () => {
  test("GET 200: returns articles with the default sorted_by set to created_at, with the latest first", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET 200: created_at can also be sorted in ascending order", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy("created_at", {
          ascending: true,
        });
      });
  });
  test("GET 400: responds with an appropriate error message if order query is invalid", () => {
    return request(app)
      .get("/api/articles?order=hotdog")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
describe("/api/articles", () => {
  test("GET: 200 returns an array of all article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(13);
      });
  });
  test("GET: 200 all article objects have the correct properties matching the columns", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        body.forEach((article) => {
          expect(article.hasOwnProperty("author"));
          expect(article.hasOwnProperty("title"));
          expect(article.hasOwnProperty("article_id"));
          expect(article.hasOwnProperty("topic"));
          expect(article.hasOwnProperty("created_at"));
          expect(article.hasOwnProperty("votes"));
          expect(article.hasOwnProperty("article_img_url"));
          expect(article.hasOwnProperty("comment_count"));
        });
      });
  });
  test("GET: 200 articles are sorted by created_at in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET: 200 article objects have a comment_count property that is equal to the number of comments associated to that article", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body;
        articles.forEach((article) => {
          expect(article.hasOwnProperty("comment_count"));
        });
        expect(articles[0].comment_count).toBe(2);
        expect(articles[6].comment_count).toBe(11);
      });
  });
  test("404: responds with an correct error message if the path is invalid", () => {
    return request(app)
      .get("/api/article")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
      });
  });
});
describe("/api/articles/:article_id/comments", () => {
  test("GET 200: should return an array of comment objects for the article matching the article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).toBe(11);
        comments.forEach((comment) => {
          expect(comment.article_id).toBe(1);
        });
      });
  });
  test("GET 200: returned comment objects should have the correct properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        comments.forEach((comment) => {
          expect(comment.hasOwnProperty("comment_id"));
          expect(comment.hasOwnProperty("votes"));
          expect(comment.hasOwnProperty("created_at"));
          expect(comment.hasOwnProperty("author"));
          expect(comment.hasOwnProperty("body"));
          expect(comment.hasOwnProperty("article_id"));
        });
      });
  });
  test("GET 200: returns an empty array if the article exists but there are no comments on it", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
        expect(body.comments.length).toBe(0);
      });
  });
  test("GET 400: responds with an approriate error message when article_id is not a number", () => {
    return request(app)
      .get("/api/articles/article_one/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("GET 404: responds with appropriate error message when article_id is that of an article that doesnt exist", () => {
    return request(app)
      .get("/api/articles/100/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("POST 201: posts a new comment to the article provded by the article_id and returns the new comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "icellusedkars",
        body: "What an incredible article. I am in awe of this.",
      })
      .expect(201)
      .then(({ body }) => {
        const newComment = body.rows[0];
        expect(typeof newComment).toBe("object");
        expect(Array.isArray(newComment)).toBe(false);
        expect(newComment.author).toBe("icellusedkars");
        expect(newComment.body).toBe(
          "What an incredible article. I am in awe of this."
        );
      });
  });
  test("POST 201: the new comment object has the same properties that all the other comments have", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "icellusedkars",
        body: "What an incredible article. I am in awe of this.",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.hasOwnProperty("comment_id"));
        expect(body.hasOwnProperty("body"));
        expect(body.hasOwnProperty("author"));
        expect(body.hasOwnProperty("article_id"));
        expect(body.hasOwnProperty("created_at"));
        expect(body.hasOwnProperty("votes"));
      });
  });
  test("POST 400: responds with appropriate error message when the article_id provided is not a number", () => {
    return request(app)
      .post("/api/articles/article_one/comments")
      .send({
        username: "icellusedkars",
        body: "What an incredible article. I am in awe of this.",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("POST 404: responds with appropriate error message when article_id is that of an article that doesnt exist", () => {
    return request(app)
      .post("/api/articles/100/comments")
      .send({
        username: "icellusedkars",
        body: "What an incredible article. I am in awe of this.",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  test("POST 400: responds with correct error message when comment body is not in the right format", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "icellusedkars",
        body: 12345,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("POST 404: responds with correct error message when username does not exist", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "VerySadKlingon",
        body: "This article made me cry, also I am a klingon from Star Trek",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid username");
      });
  });
  test("POST 201: responds with correct article object even when unnecessary properties are on the request", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "icellusedkars",
        body: "What an incredible article. I am in awe of this.",
        favourite_colour: "blue",
        votes: 5,
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.rows[0].hasOwnProperty("article_id"));
        expect(body.rows[0].hasOwnProperty("author"));
        expect(body.rows[0].hasOwnProperty("body"));
        expect(body.rows[0].hasOwnProperty("comment_id"));
        expect(body.rows[0].hasOwnProperty("created_at"));
        expect(body.rows[0].hasOwnProperty("votes"));
        expect(!body.rows[0].hasOwnProperty("favourite_colour"));
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("PATCH 200: responds with a complete article object with all the correct properties", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 5 })
      .expect(200)
      .then(({ body }) => {
        const article = body[0];
        expect(article.hasOwnProperty("article_id"));
        expect(article.hasOwnProperty("title"));
        expect(article.hasOwnProperty("topic"));
        expect(article.hasOwnProperty("author"));
        expect(article.hasOwnProperty("body"));
        expect(article.hasOwnProperty("created_at"));
        expect(article.hasOwnProperty("votes"));
        expect(article.hasOwnProperty("article_img_url"));
      });
  });
  test("PATCH 200: responds with an article object where the votes are increased by the correct amount", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 5 })
      .expect(200)
      .then(({ body }) => {
        const article = body[0];
        expect(article.votes).toBe(105);
      });
  });
  test("PATCH 200: responds with an article object where the votes are decreased by the correct amount", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -10 })
      .expect(200)
      .then(({ body }) => {
        const article = body[0];
        expect(article.votes).toBe(90);
      });
  });
  test("PATCH 400: responds with correct error when inc_vote is of invalid type", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "not a number" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("PATCH 400: responds with a correct error when article_id is not valid", () => {
    return request(app)
      .patch("/api/articles/numberone")
      .send({ inc_votes: 5 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("PATCH 400: responds with correct error when inc_votes is not included in the request", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("PATCH 404: responds with correct error message when given a valid but non-existent article_id", () => {
    return request(app)
      .patch("/api/articles/150")
      .send({ inc_votes: 5 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("DELETE 204: deletes a comment based on the comment_id and doesnt return it", () => {
    return request(app)
      .delete("/api/comments/3")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("DELETE 404: responds with correct error message when given valid but non-existent comment_id", () => {
    return request(app)
      .delete("/api/comments/100")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found");
      });
  });
  test("DELETE 400: responds with a correct error message when given a an invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/ten")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("GET 200: returns an array of all user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body;
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user.hasOwnProperty("username"));
          expect(user.hasOwnProperty("name"));
          expect(user.hasOwnProperty("avatar_url"));
        });
      });
  });
  test("GET 404: should return correct error message if users is spelt wrong or the path is otherwise incorrect", () => {
    return request(app)
      .get("/api/useers")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
      });
  });
});

describe("GET: GET /api/articles (topic query)", () => {
  test("GET 200: returns an array of article objects filtered by specific topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const articles = body;
        expect(articles.length).toBe(12);
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("GET 200: returns an empty array if topic exists but there are no articles for it", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const response = body;
        expect(response.length).toBe(0);
      });
  });
  test("GET 404: returns correct error message passed topic that is not a string", () => {
    return request(app)
      .get("/api/articles?topic=sandwiches")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic not found");
      });
  });
});

describe("GET /api/users/:username", () => {
  test("GET 200: returns a single user object", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
        expect(Array.isArray(body)).toBe(false);
      });
  });
  test("GET 200:returned username object has the correct properties", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        expect(body.hasOwnProperty("username"));
        expect(body.hasOwnProperty("name"));
        expect(body.hasOwnProperty("avatat_irl"));
      });
  });
  test("GET 404: returns correct error when passed an invalid username", () => {
    return request(app)
      .get("/api/users/123")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("PATCH 200: responds with a complete comment object with all the correct properties", () => {
    return request(app)
      .patch("/api/comments/3")
      .send({ inc_votes: 5 })
      .expect(200)
      .then(({ body }) => {
        expect(body.hasOwnProperty("comment_id"));
        expect(body.hasOwnProperty("body"));
        expect(body.hasOwnProperty("votes"));
        expect(body.hasOwnProperty("author"));
        expect(body.hasOwnProperty("article_id"));
        expect(body.hasOwnProperty("created_at"));
      });
  });
  test("PATCH 200: responds with an article object where the votes are increased by the correct amount", () => {
    return request(app)
      .patch("/api/comments/3")
      .send({ inc_votes: 5 })
      .expect(200)
      .then(({ body }) => {
        expect(body.votes).toBe(105);
      });
  });
  test("PATCH 200: responds with an article object where the votes are decreased by the correct amount", () => {
    return request(app)
      .patch("/api/comments/3")
      .send({ inc_votes: -5 })
      .expect(200)
      .then(({ body }) => {
        expect(body.votes).toBe(95);
      });
  });
  test("PATCH 400: responds with correct error when inc_vote is of invalid type", () => {
    return request(app)
      .patch("/api/comments/3")
      .send({ inc_votes: "not a number" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("PATCH 400: responds with a correct error when comment_id is not valid", () => {
    return request(app)
      .patch("/api/comments/numberone")
      .send({ inc_votes: 5 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("PATCH 400: responds with correct error when inc_votes is not included in the request", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("PATCH 404: responds with correct error message when given a valid but non-existent comment_id", () => {
    return request(app)
      .patch("/api/comments/150")
      .send({ inc_votes: 5 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found");
      });
  });
});
