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
        const article = body.article;
        expect(typeof article).toBe("object")
        expect(Array.isArray(article)).toBe(false)
      });
  });
  test("200: article has correct properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
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

describe("/api/articles", () => {
    test("GET: 200 returns an array of all article objects", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
            expect(Array.isArray(body)).toBe(true)
            expect(body.length).toBe(13)
        })
    })
    test("GET: 200 all article objects have the correct properties matching the columns", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
            body.forEach((article) => {
                expect(article.hasOwnProperty("author"))
                expect(article.hasOwnProperty("title"))
                expect(article.hasOwnProperty("article_id"))
                expect(article.hasOwnProperty("topic"))
                expect(article.hasOwnProperty("created_at"))
                expect(article.hasOwnProperty("votes"))
                expect(article.hasOwnProperty("article_img_url"))
                expect(article.hasOwnProperty("comment_count"))
            })
        })
    })
    test("GET: 200 articles are sorted by created_at in descending order", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
            expect(body).toBeSortedBy("created_at", {
                descending: true
            })
        })
    })
    test("GET: 200 article objects have a comment_count property that is equal to the number of comments associated to that article", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
            
            body.forEach((article) => {
                expect(article.hasOwnProperty("comment_count"))
            })
            expect(body[0].comment_count).toBe(2)
            expect(body[6].comment_count).toBe(11)
        })
    })
    test("404: responds with an correct error message if the path is invalid", () => {
        return request(app)
          .get("/api/article")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("path not found");
          });
      });
})