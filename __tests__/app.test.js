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
        expect(topics.length).toBe(3)
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
      test("200: responds with an object describing all the available endpoints on the API", () => {
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
                expect(endpoint.hasOwnProperty('description')).toBe(true)
            })
          });
      });
   

});
