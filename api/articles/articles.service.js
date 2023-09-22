const Article = require('./articles.model');

const createArticle = async (data, userId) => {
  data.user = userId;
  const article = new Article(data);
  return await article.save();
};

const updateArticle = async (id, data, userId) => {
  const article = await Article.findById(id);
  if (article && String(article.user) === String(userId)) {
    Object.assign(article, data);
    return await article.save();
  }
  return false;
};

const deleteArticle = async (id, userId) => {
  const article = await Article.findById(id);
  if (article && String(article.user) === String(userId)) {
    await article.remove();
    return true;
  }
  return false;
}; 

const getUserArticles = async (userId) => {
    return await Article.find({ user: userId }).populate('user', '-password');
};
  
module.exports = { createArticle, updateArticle, deleteArticle, getUserArticles };
