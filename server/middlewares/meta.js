function query(req, res, next) {
  res.locals.meta = {
    title: 'BlogPost',
    description: 'One more platform for blogging'
  };
  req.setMeta = function({ title, description }) {
    if (title) {
      res.locals.meta.title = `BlogPost — ${title}`;
    }
    if (description) {
      res.locals.meta.description = description;
    }
  }
  next();
}

module.exports = query
