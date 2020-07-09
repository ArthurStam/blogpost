const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const posts = require('./server/api/posts');
const users = require('./server/api/users');
const comments = require('./server/api/comments');
const authenticated = require('./server/middlewares/authenticated');
const query = require('./server/middlewares/query');
const meta = require('./server/middlewares/meta');
const errorCodes = require('./server/errorCodes');
const { markdownPost, collapseComments } = require('./server/utils');

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('static'));
app.use(authenticated);
app.use(query);
app.use(meta);

app.get('/', (req, res, next) => {
  posts.get({ search: req.query.search }).then((posts) => {
    res.render('posts', { posts: posts.map(markdownPost) });
  }).catch(() => {
    next();
  })
});

app.get('/login', (req, res) => {
  if (!req.authenticated) {
    res.render('login');
  } else {
    res.redirect('/');
  }
});

app.get('/signup', (req, res) => {
  if (!req.authenticated) {
    res.render('signup');
  } else {
    res.redirect('/');
  }
});

app.get('/posts/create', (req, res) => {
  res.render('posts/create');
});

app.post('/posts/create', (req, res) => {
  const { title, text } = req.body;

  const data = { title, text }

  if (req.authenticated) {
    data.user_id = req.user_id;
  }

  if (!title || !text) {
    res.sendStatus(400);
  } else {
    posts.create(data).then((post_id) => {
      res.redirect(`/posts/${post_id}`);
    }).catch(() => {
      res.sendStatus(400);
    })
  }
});

app.get('/posts/:post_id', (req, res, next) => {
  const post_id = req.params.post_id;
  Promise.all([
    posts.getById({ post_id }),
    comments.get({ post_id })
  ]).then(([post, comments]) => {
    req.setMeta({ title: post.title, description: post.text.slice(0, 100) });
    res.render('posts/post', { post: markdownPost(post), comments: collapseComments(comments) });
  }).catch((error) => {
    switch (error.message) {
      case errorCodes.ERROR_CODE_POST_NOT_FOUND:
        res.render('404');
        break;
      default:
        next();
    }
  })
});

app.post('/login', (req, res, next) => {
  const { login, password } = req.body;
  if (!login || !password) {
    res.sendStatus(400);
  } else {
    users.login({ login, password }).then((token) => {
      res.cookie('token', token);
      res.redirect('/');
    }).catch((error) => {
      switch (error.message) {
        case errorCodes.ERROR_CODE_USER_NOT_FOUND:
          res.sendStatus(400);
          break;
        default:
          next();
      }
    })
  }
})

app.post('/signup', (req, res, next) => {
  const { login, password, password2, nickname } = req.body;
  if (!nickname || !login || !password || password !== password2) {
    res.sendStatus(400);
  } else {
    users.signup({ login, password, nickname }).then((token) => {
      res.cookie('token', token);
      res.redirect('/');
    }).catch((error) => {
      switch (error.message) {
        case errorCodes.ERROR_CODE_USER_ALREADY_EXIST:
        case errorCodes.ERROR_CODE_NICKNAME_ALREADY_EXIST:
          res.sendStatus(400);
          break;
        default:
          next();
      }
    })
  }
})

app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

app.get('/@:nickname', (req, res, next) => {
  const nickname = req.params.nickname;
  users.get({ nickname }).then((user) => {
    return user;
  }).then((user) => {
    return posts.get({ user_id: user.user_id })
  }).then((posts) => {
    res.render('user', { posts: posts.map(markdownPost) })
  }).catch((error) => {
    switch (error.message) {
      case errorCodes.ERROR_CODE_USER_NOT_FOUND:
        res.render('404');
        break;
      default:
        next();
    }
  })
});

app.post('/comments/create', (req, res, next) => {
  if (req.authenticated) {
    const user_id = req.user_id;
    const { text, post_id, parent_id } = req.body;

    if (!text || !post_id || !user_id) {
      res.sendStatus(400);
    } else {
      comments.create({ text, user_id, post_id, parent_id }).then(() => {
        res.redirect(`/posts/${post_id}`);
      }).catch(() => {
        next();
      })
    }
  } else {
    res.sendStatus(400);
  }
})

app.use((req, res) => {
  res.sendStatus(500);
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port 3000');
});
