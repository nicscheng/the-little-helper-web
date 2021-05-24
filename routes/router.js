const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { forwardAuthenticated } = require('../config/auth');
const ObjectID = require('mongodb').ObjectID;
const controller = require('../controller/controller');
//const { Collection } = require('mongoose');
const Collection = require('../models/collection');

/*router.get('/create-post', (req, res) => {

});*/

router.get('/', isLoggedIn, async(req, res) => {

  if(req.query.search) {
    //const{title} = req.query;
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    const allPosts = await Post.find({title: regex})

    res.render('generalfeed', {
      user: req.user, isLoggedIn: req.isLogged,
      posts: allPosts
    });

    } 
    else {
        res.render('index', {
          user: req.user, isLoggedIn: req.isLogged,
        });
    }
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
     req.isLogged = true
     return next();
  }

  req.isLogged = false;
  return next();
}

/*function logout(req, res, next) {
  req.isLogged = false;
}*/

/*router.get('/index2', (req, res) => {
  res.render('index2');
});*/

router.get('/login', (req, res) => {
  res.render('index');
});

router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
})

router.get('/register', (req, res) => res.render('index'));

router.post('/register', (req, res) => {
    const {username, password, avatar, email, bio} = req.body;
    let errors = [];

    if(!username || !password || !email || !bio)
    {
        errors.push({msg: 'Please fill in all fields'});
    }

    User.findOne({email: email})
        .then(user => {
            if(user) {
                console.log("user exists!");
                errors.push({msg: 'Email already exists!'});
                res.render('index', {
                    errors,
                    username,
                    password,
                    avatar,
                    email,
                    bio
                });
            } else {
                const newUser = new User({
                    username,
                    password,
                    avatar, 
                    email,
                    bio
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                      if (err) throw err;
                      newUser.password = hash;
                      /*newUser.save()
                        .then(user => {
                          res.redirect('/');
                          console.log("GO TO PROFILE");
                        })
                        .catch(err => console.log(err));*/
                        User.create(newUser);
                        res.render('index', {
                          user: req.body, isLoggedIn: false
                        });
                      console.log('User created successfully');
                    });
                });             
            }
        });
});

router.get('/index2', (req, res) => {
  res.render('index2');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/'
  })(req, res, next);
});

router.get('/profile', isLoggedIn, async(req, res) => {
  if(req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    const allPosts = await Post.find({title: regex})
    const likedPosts = await Like.find({liker:[req.user.username]})
    //const collectPosts = await 

    res.render('generalfeed', {
      user: req.user, isLoggedIn: req.isLogged,
      posts: allPosts, faves: likedPosts
    });
  }

  if(req.query.search2){
    const regex = new RegExp(escapeRegex(req.query.search2), 'gi');
    const allPosts = await Post.find({title: regex, author: [req.user.username]})
    const likedPosts = await Like.find({liker:[req.user.username]})

    res.render('profile', {
      user: req.user, isLoggedIn: req.isLogged,
      posts: allPosts, faves: likedPosts
    });
  }

  else{
    const allPosts = await Post.find({author:[req.user.username]})
    const likedPosts = await Like.find({liker:[req.user.username]})
    console.log(likedPosts)
    res.render('profile', {
      user: req.user, isLoggedIn: req.isLogged,
      posts: allPosts, faves: likedPosts
    });   
  }

});

router.get('/edit-profile/:id', (req, res) => {
  User.findById(req.params.id, (err, user) => {
    res.render('profile', {
      user:user
    });
  });
});

router.post('/edit-profile/:id', (req, res) => {
  let user = {};
  user.username = req.body.username;
  user.bio = req.body.bio;
  user.avatar = req.body.avatar;
  //console.log(user.body.password);

  let query = {_id: req.params.id}

  User.updateOne(query, user, (err) => {
    if (err)
    {
      console.log(err);
      return;
    }
    else{
      res.redirect('/profile');
    }
  });
});

 router.get('/delete-account/:id', (req, res) => {
  User.findById(req.params.id, (err, user) => {
    res.render('profile', {
      user:user
    });
  });
});

 router.post('/delete-account/:id', async (req, res) => {

  try 
  {
    if (!req.user._id)
    {
      res.status(500).send();
    }
    let query = { _id: req.params.id }
    const user = await User.findById(req.params.id);
    remove = await User.findByIdAndRemove(query);
    if (remove) 
    {
      //res.send('Success');
      res.redirect('/');
    }
  } 
  catch (e)
  {
    res.send(e);
  }

});

router.get('/generalprof', isLoggedIn, async(req, res) => {
  if(req.query.search) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      const allUsers = await User.find({username: regex})

      res.render('generalprof', {
        user: req.user, isLoggedIn: req.isLogged,
        users: allUsers
      }); 

  } 

  else {
    const allUsers = await User.find()
    
    res.render('generalprof', {
      user: req.user, isLoggedIn: req.isLogged,
      users: allUsers
    });
  }

});

/*router.get('/add-favorites/:id', (req, res) => {
  //res.render('post')
  console.log("favorites");

  Post.findById(req.params.id, (err, user) => {
    res.render('post')
  });
});*/

router.get('/add-favorites/:id', async(req, res) => {
  let like = {};
  let query = {_id: req.params.id};
  like.liker = req.user.username;
  like.postID = query;
  const liked = await Post.findById(req.params.id);

  like.title = liked.title;
  like.content = liked.content;

  const likes = new Like(like);

  //console.log("favorites");

  likes.save((err, likes) => {
    if(err)
    {
      console.log(err);
      return;
    }
    else
    {
      res.redirect(`/post/${req.params.id}`);
    }
  })
});

router.get('/new-collection/:id', (req, res) => {
  res.render('post');
});

router.post('/new-collection/:id', async(req, res) => {
  let collect = {};
  collect.collectName = req.body.collectName;
  collect.collector = req.user.username;
  let query = {_id: req.params.id};
  collect.postID = query;

  console.log(collect.name);

  const collected = await Post.findById(req.params.id);

  collect.title = collected.title;
  collect.content = collected.content;

  const collects = new Collection(collect);

  collects.save((err, collections) => {
    if(err)
    {
      console.log(err);
      return;
    }
    else
    {
      res.redirect(`/post/${req.params.id}`);
    }
  })
});

router.get('/old-collection/:id', async(req, res) => {
  let collect = {};
  let query = {_id: req.params.id};
  collect.name = req.body.name;
  collect.collector = req.user.username;
  collect.postID = query;

  const collected = await Post.findById(req.params.id);

  collect.title = collected.title;
  collect.content = collected.content;

  const collects = new Collection(collect);

  collects.save((err, collections) => {
    if(err)
    {
      console.log(err);
      return;
    }
    else
    {
      res.redirect(`/post/${req.params.id}`);
    }
  })
});
/*router.get('/', (req, res) => {
  //res.render('profile');
  //const {username, password, avatar, bio} = req.body;
  const users = req.app.locals.users;
  const _id = ObjectID(req.session.passport.user);

  users.findOne({ _id }, (err, results) => {
    if(err)
    {
      throw err;
    }
    res.render('profile', {...results});
  })
});*/

/*router.get('/edit-profile', (req, res) => {
  axios.get('http://localhost:3000/api/users', {params:{id: req.query.id}})
    .then(function(userdata)
    {
      res.render("profile", {user: userdata.data});
    })
    .catch(err => {
      res.send(err);
    })
});*/

/*exports.edit_profile = (req, res) => {
  axios.get('http://localhost:3000/api/users', {params:{id: req.user._id}})
    .then(function(userdata)
    {
      res.render("edit_profile", {user: userdata.data});
    })
    .catch(err => {
      res.send(err);
    })
}*/

router.get('/post-form', (req, res) => {
  res.render('profile');
});

router.post('/post-form', (req, res) => {
  let post = {};
  post.title = req.body.title;
  post.content = req.body.content;
  post.link = req.body.link;
  post.img1 = req.body.img1;
  post.img2 = req.body.img2;
  post.img3 = req.body.img3;
  post.img4 = req.body.img4;
  post.img5 = req.body.img5;
   post.link = req.body.url;
  post.postID = req.user._id;
  post.category = req.body.category;
  post.author = req.user.username;
  title = post.title;

  const posts = new Post(post)

    posts.save((err, posts) => {
      if (err)
      {
        console.log(err);
        return;
      }
      else{
        res.redirect('/profile');
      }
    })
});

router.get('/comment-form/:id', (req, res) => {
  res.render('post');
});

router.post('/comment-form/:id', (req, res) => {
  let comment = {};
  let query = {_id: req.params.id}
  comment.writer = req.user.username;
  comment.content = req.body.comment;
  comment.postTitle = req.params.title;
  comment.postID = query;

  const comments = new Comment(comment);

  //console.log(query);

  comments.save((err, comments) => {
    if(err)
    {
      console.log(err);
      return;
    }
    else{
      res.redirect(`/post/${req.params.id}`);
    }
  })
})

//API 

router.get('/api/users', controller.find);
router.put('/api/users/:id', controller.update);
router.delete('/api/users/:id', controller.delete);

/*router.post('/edit-profile', (req, res) => {
  
});*/

/*router.get('/post', isLoggedIn, (req, res) =>{
  res.render('post',{
    user: req.user, isLoggedIn: req.isLogged
  })
})*/

/*router.get('/post', isLoggedIn, (req, res) => {
  
    res.render('post', {
      user: req.user, isLoggedIn: req.isLogged
    })
  
});*/


/*router.get('/post', isLoggedIn, async(req, res) => {

  if(req.query.search) {
      //const{title} = req.query;
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      const allPosts = await Post.find({title: regex})

      res.render('generalfeed', {
        user: req.user, isLoggedIn: req.isLogged,
        posts: allPosts
      });

  } else {
      const allPosts = await Post.find()

      res.render('generalfeed', {
        user: req.user, isLoggedIn: req.isLogged,
        posts: allPosts
      });
  }

});*/

/*router.post('/post/:id', isLoggedIn, async(req, res) => {
  if(req.query.search) {
    //const{title} = req.query;
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    const allPosts = await Post.find({title: regex})

    res.render('generalfeed', {
      user: req.user, isLoggedIn: req.isLogged,
      posts: allPosts
    });
  }

  else{  
    res.render('post', {
      user: req.user, isLoggedIn: req.isLogged
    });
  }

  try 
  {    
    let query = { _id: req.params.id }
    //const post = await Post.findById(req.params.id);
    const getPost = await Post.findById(query);
    if (getPost) 
    {
      //res.send('Success');
      //res.redirect('/post');
      res.render('post', {
        user: req.user, isLoggedIn: req.isLogged,
        post: getPost
      })
      //res.send(getPost);
    }
  } 
  catch (e)
  {
    res.send(e);
  }

});*/

router.get('/generalfeed', isLoggedIn, async(req, res) => {

  if(req.query.search) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      const allPosts = await Post.find({title: regex})

      res.render('generalfeed', {
        user: req.user, isLoggedIn: req.isLogged,
        posts: allPosts
      });

  } else {
      const allPosts = await Post.find()

      res.render('generalfeed', {
        user: req.user, isLoggedIn: req.isLogged,
        posts: allPosts
      });
  }

});

router.get('/post/:id', isLoggedIn, async(req, res) => {

  const comments = await Comment.find({postID:[req.params.id]})

  Post.findOne({"_id": ObjectID(req.params.id)}, (err, post) => {
    res.render('post', {
      post:post, isLoggedIn: req.isLogged, comments:comments
    });
  });

  /*if(req.query.search) {
    //const{title} = req.query;
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    const allPosts = await Post.find({title: regex})

    res.render('generalfeed', {
      user: req.user, isLoggedIn: req.isLogged,
      posts: allPosts
    });
  }

  else{  
    res.render('post', {
      user: req.user, isLoggedIn: req.isLogged
    });
  }*/

});


router.get('/baking', isLoggedIn, async(req, res) => {
  if(req.query.search) {
    //const{title} = req.query;
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    const allPosts = await Post.find({title: regex, category:'baking'})

    res.render('baking', {
      user: req.user, isLoggedIn: req.isLogged,
      posts: allPosts
    });
  }
  else {
    const allPosts = await Post.find({category:'baking'})

    res.render('baking', {
      user: req.user, isLoggedIn: req.isLogged,
      posts: allPosts
    });
  }
 
});

router.get('/error', (req, res) => {
  res.render('error');
});
router.get('/about', isLoggedIn, (req, res) => {
  res.render('about',{
    user: req.user, isLoggedIn: req.isLogged,
  });
});

router.get('/cooking', isLoggedIn, async(req, res) => {
  if(req.query.search) {
    //const{title} = req.query;
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    const allPosts = await Post.find({title: regex, category:'cooking'})

    res.render('cooking', {
      user: req.user, isLoggedIn: req.isLogged,
      posts: allPosts
    });
  }
  else {
    const allPosts = await Post.find({category:'cooking'})

    res.render('cooking', {
      user: req.user, isLoggedIn: req.isLogged,
      posts: allPosts
    });
  }
});

router.get('/budgeting', isLoggedIn, async(req, res) => {
  if(req.query.search) {
    //const{title} = req.query;
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    const allPosts = await Post.find({title: regex, category:'budgeting'})

    res.render('budgeting', {
      user: req.user, isLoggedIn: req.isLogged,
      posts: allPosts
    });
  }
  else {
    const allPosts = await Post.find({category:'budgeting'})

    res.render('budgeting', {
      user: req.user, isLoggedIn: req.isLogged,
      posts: allPosts
    });
  }
});

router.get('/gardening', isLoggedIn, async(req, res) => {
  if(req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    const allPosts = await Post.find({title: regex, category:'gardening'})

    res.render('gardening', {
      user: req.user, isLoggedIn: req.isLogged,
      posts: allPosts
    });
  }
  else {
    const allPosts = await Post.find({category:'gardening'})

    res.render('gardening', {
      user: req.user, isLoggedIn: req.isLogged,
      posts: allPosts
    });
  }
});

router.get('/sewing', isLoggedIn, async(req, res) => {
  if(req.query.search) {
    //const{title} = req.query;
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    const allPosts = await Post.find({title: regex, category:'sewing'})

    res.render('sewing', {
      user: req.user, isLoggedIn: req.isLogged,
      posts: allPosts
    });
  }
  else {
    const allPosts = await Post.find({category:'sewing'})

    res.render('sewing', {
      user: req.user, isLoggedIn: req.isLogged,
      posts: allPosts
    });
  }
});

router.get('/user-list', async (req, res) => {
  try {
    const users = await User.find()
    return res.render('user-list', { users })
  } catch (err) {
    return res.status(400)
  }
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
