//FQ9MJyM

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');
const alert = require('alert');
const notifier = require('node-notifier');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
var requestedPostId1;

app.set('view engine', 'ejs');

//mongoose.connect("mongodb+srv://Admin:Priyaish38@blog-app.ko4hp.mongodb.net/blogDB?retryWrites=true&w=majority");
mongoose.connect('mongodb://127.0.0.1:27017/blogDB');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

const postSchema = {
  title: String,
  content: String
}

const loginSchema = {
  username: String,
  password: String
}

const Post = mongoose.model("post", postSchema);
const Login = mongoose.model("login", loginSchema);

app.get("/", function(req, res) {
  Post.find({}, function(err, results) {
    if (!err) {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: results
      });
    }
  });
});

app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});

app.get("/compose", function(req, res) {
  res.render("login", {
    page: "compose"
  });
  // res.render("compose");
});

app.get("/posts/:postID", function(req, res) {
  const requestedTitle = req.params.postID;

  Post.findOne({
    _id: requestedTitle
  }, function(err, post) {

    if (!err) {
      res.render("post", {
        title: post.title,
        content: post.content,
        postId: requestedTitle
      });
    }
  });

});

// app.get("/login", function(req, res) {
//   res.render("login", {
//     page: "compose"
//   });
// });

app.post("/login", function(req, res) {
  var login_name=req.body.login_button;
  Login.findOne({
    username: req.body.userName,
    password: req.body.passWord
  }, function(err, login) {
    if (!err) {
      if (login) {
        notifier.notify('Login Successful !!!!!!');

        if (login_name==="delete") {
          deleteFun();
          res.redirect("/");
        } else {
          res.render(login_name);
        }

      } else {
        notifier.notify({
          title: 'Login Unsuccessful !!!!!!!',
          message: 'Kindly enter correct username and password'
        });

        if (login_name==="delete") {
          res.redirect("/");
          // res.redirect("/posts/"+requestedPostId1);
        } else {
          res.redirect("/compose");
        }
      }
    }
  })
});

app.post("/compose", function(req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });

});

app.post("/delete", function(req, res) {
  requestedPostId1 = req.body.delete;
  res.render("login", {
    page: "delete"
  });

});

function deleteFun() {
  Post.findByIdAndRemove(requestedPostId1, function(err) {
    if (!err) {
      console.log("Successfully deleted checked item");
    }
  });
}

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});
