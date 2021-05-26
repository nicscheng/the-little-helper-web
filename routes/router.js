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
const multer = require('multer');
const fs = require('fs');


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

const uploadStorage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'public/uploads');
  },
  filename: function(req, file, cb){
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  }
});

const upload = multer({storage:uploadStorage});

router.post('/register', upload.single('avatar'), (req, res) => {
    const {username, password, email, bio} = req.body;
    const avatar = req.file.filename;
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
    const collectPosts = await Collection.find({collector:[req.user.username]})

    res.render('generalfeed', {
      user: req.user, isLoggedIn: req.isLogged,
      posts: allPosts, faves: likedPosts,
      collects: collectPosts
    });
  }

  if(req.query.search2){
    const regex = new RegExp(escapeRegex(req.query.search2), 'gi');
    const allPosts = await Post.find({title: regex, author: [req.user.username]})
    const likedPosts = await Like.find({liker:[req.user.username]})
    const collectPosts = await Collection.find({collector:[req.user.username]})

    res.render('profile', {
      user: req.user, isLoggedIn: req.isLogged,
      posts: allPosts, faves: likedPosts,
      collects: collectPosts
    });
  }
  else{
    const allPosts = await Post.find({author:[req.user.username]})
    const likedPosts = await Like.find({liker:[req.user.username]})
    const collectPosts = await Collection.find({collector:[req.user.username]})

    console.log(likedPosts)
    res.render('profile', {
      user: req.user, isLoggedIn: req.isLogged,
      posts: allPosts, faves: likedPosts,
      collects: collectPosts
    });   
  }

});

router.get('/collections/:collectName', isLoggedIn, async(req, res) => {

  const collectPosts = await Collection.find({collectName:[req.params.collectName]});

  res.render('collections', {
    isLoggedIn: req.isLogged,
    collects: collectPosts
  });
});


router.get('/edit-profile/:id', (req, res) => {
  User.findById(req.params.id, (err, user) => {
    res.render('profile', {
      user:user
    });
  });
});

router.post('/edit-profile/:id',  upload.single('avatar'), (req, res) => {
  let user = {};
  user.username = req.body.username;
  user.bio = req.body.bio;
  //user.avatar = req.file.filename;
  //console.log(user.body.password);
  let query = {_id: req.params.id}

  if(req.file)
  {
    user.avatar = req.file.filename;
    try
    {
      fs.unlinkSync('./uploads/' + req.body.old_avatar);
    }
    catch(err)
    {
      console.log(err);
    }
  }
  else
  {
    user.avatar = req.body.old_avatar;
  }

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

router.get('/edit-post/:id', (req, res) => {
  Post.findById(req.params.id, (err, post) => {
    res.render('post', {
      post:post
    });
  });
});

router.post('/edit-post/:id', (req, res) => {
  let post = {};
  post.title = req.body.title;
  post.content = req.body.content;
  post.img1 = req.body.img1;
  post.img2 = req.body.img2;
  post.img3 = req.body.img3;
  post.img4 = req.body.img4;
  post.img5 = req.body.img5;
  post.link = req.body.link;
  post.category = req.body.category;

  let query = {_id: req.params.id}

  Post.updateOne(query, post, (err) => {
    if(err)
    {
      console.log(err);
      return;
    }
    else{
      res.redirect(`/post/${req.params.id}`);
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
      res.redirect('/');
    }
  } 
  catch (e)
  {
    res.send(e);
  }

});

router.get('/userprofile/:user', isLoggedIn, async(req, res) => {
  if(req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    const allPosts = await Post.find({title: regex})
    const likedPosts = await Like.find({liker:[req.params.user]})
    const collectPosts = await Collection.find({collector:[req.params.user]})
    const users = await User.find({username:[req.params.user]});

    res.render('generalfeed', {
      users: users, isLoggedIn: req.isLogged,
      posts: allPosts, faves: likedPosts,
      collects: collectPosts
    });
  }

  if(req.query.search2){
    const users = await User.findOne({username:[req.params.user]})
    const regex = new RegExp(escapeRegex(req.query.search2), 'gi');
    const allPosts = await Post.find({title: regex, author: [req.params.user]})
    const likedPosts = await Like.find({liker:[req.params.user]})
    const collectPosts = await Collection.find({collector:[req.params.user]})
    console.log(users);

    res.render('userprofile', {
      users: users, isLoggedIn: req.isLogged,
      posts: allPosts, faves: likedPosts,
      collects: collectPosts
    });
  }
  else{
    const users = await User.findOne({username:[req.params.user]})
    const allPosts = await Post.find({author:[req.params.user]})
    const likedPosts = await Like.find({liker:[req.params.user]})
    const collectPosts = await Collection.find({collector:[req.params.user]})

    //console.log(users.username);

    res.render('userprofile', {
      users: users, isLoggedIn: req.isLogged,
      posts: allPosts, faves: likedPosts,
      collects: collectPosts
    });   
  }
})


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

router.get('/delete-collection/:id', isLoggedIn, async(req, res) => {
  const allPosts = await Post.find({author:[req.user.username]})
  const likedPosts = await Like.find({liker:[req.user.username]})
  const collectPosts = await Collection.find({collector:[req.user.username]})

  Collection.findById(req.params.id, (err, collect) => {
    res.render('profile', {
      user: req.user, isLoggedIn: req.isLogged,
      posts: allPosts, faves: likedPosts,
      collects: collectPosts
    });
  });
});

router.post('/delete-collection/:id', async (req, res) => {
  try 
  {
    if (!req.user._id)
    {
      res.status(500).send();
    }
    let query = req.params.id;
    //const user = await User.findById(req.params.id);
    const remove = await Collection.findByIdAndRemove(query);
    if (remove) 
    {
      res.redirect('/profile');
    }
  } 
  catch (e)
  {
    res.send(e);
  }

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


router.get('/post-form',(req, res) => {
  res.render('profile');
});


router.post('/post-form', (req, res) => {
  let post = {};
  post.title = req.body.title;
  post.content = req.body.content;
  post.link = req.body.link;
  //post.img1 = req.file.filename;
  //post.img2 = req.file.filename;
  //post.img3 = req.file.filename;
  //post.img4 = req.file.filename;
  //post.img5 = req.file.filename;
  post.postID = req.user._id;
  //post.link = req.body.url;
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
  const collectNames = await Collection.distinct("collectName");
  //const user = req.user.username;

  console.log(collectNames);
  Post.findOne({"_id": ObjectID(req.params.id)}, (err, post) => {
    res.render('post', {
      post:post, isLoggedIn: req.isLogged, comments:comments,
      user:req.user, collectNames:collectNames
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
