const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mockingoose = require("mockingoose");
const User = require("../api/users/users.model");
const usersService = require("../api/users/users.service");
const Article = require("../api/articles/articles.model");
const articlesService = require("../api/articles/articles.service");

jest.mock('../api/users/users.service');

describe("Article API tests", () => {
  let token;
  const USER_ID = "fake";
  const ARTICLE_ID = "fake_article";
  const MOCK_ARTICLE_DATA = [
    {
      _id: ARTICLE_ID,
      title: "Test Title",
      content: "Test Content",
      user: USER_ID,
    },
  ];
  const MOCK_ARTICLE_CREATED = {
    title: "New Test Title",
    content: "New Test Content",
  };

  const mockArticleInstance = {
    ...MOCK_ARTICLE_DATA[0]
  };
  
  mockArticleInstance.save = jest.fn().mockResolvedValue(mockArticleInstance);
  mockArticleInstance.remove = jest.fn().mockResolvedValue({ ok: 1 });
  
  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID, role: 'admin' }, config.secretJwtToken);
    mockingoose(Article).toReturn(MOCK_ARTICLE_DATA, "find");
    jest.spyOn(Article, 'findById').mockResolvedValue(mockArticleInstance);
    mockingoose(User).toReturn({ _id: USER_ID, role: 'admin' }, "findOne");
    usersService.get.mockResolvedValue({ _id: USER_ID, role: 'admin' });
  });

  test("[Articles] Create Article", async () => {
    const res = await request(app)
      .post("/api/articles")
      .send(MOCK_ARTICLE_CREATED)
      .set("x-access-token", token);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(MOCK_ARTICLE_CREATED.title);
  });

  test("[Articles] Update Article", async () => {
    const res = await request(app)
      .put(`/api/articles/${ARTICLE_ID}`)
      .send({ title: "Updated Title" })
      .set("x-access-token", token);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated Title");
  });

  test("[Articles] Delete Article", async () => {
    const res = await request(app)
      .delete(`/api/articles/${ARTICLE_ID}`)
      .set("x-access-token", token);
    expect(res.status).toBe(204);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});