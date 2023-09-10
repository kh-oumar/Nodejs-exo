const NotFoundError = require("../../errors/not-found");
const UnauthorizedError = require("../../errors/unauthorized");
const articlesService = require("./articles.service");

class ArticlesController {
  async create(req, res, next) {
    try {
      const article = await articlesService.createArticle(req.body, req.user._id);
      req.io.emit("article:create", article);
      res.status(201).json(article);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
        
      if (req.user.role !== 'admin') {
        throw new UnauthorizedError();
      }

      const id = req.params.id;
      const updatedArticle = await articlesService.updateArticle(id, req.body, req.user._id);
      res.json(updatedArticle);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      if (req.user.role !== 'admin') { 
        throw new UnauthorizedError();
      }

      const id = req.params.id;
      await articlesService.deleteArticle(id, req.user._id);
      req.io.emit("article:delete", { id }); 
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ArticlesController();
