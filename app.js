const { render } = require("ejs");
const { response } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const Blog = require("./models/blog");

//express app
const app = express();

//Connect to MongoDB
const dbURI =
  "mongodb+srv://call-from-node:ihatepasswords@nodejsblog1.5xtxb.mongodb.net/nodejsblog1?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("==>  Connected to MongoDB!");
    //listen for requests
    app.listen(1200);
  })
  .catch((err) => {
    console.log(err);
  });

//register view engine
app.set("view engine", "ejs");
app.set("views", "views"); //path to views

//Mongoose and mongo sandbox routes
/*
app.get("/add-blog", (req, res) => {
  const blog = new Blog({
    title: "new blog",
    snippet: "about my new blog",
    body: "more about my new blog",
  });

  blog
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/all-blogs", (req, res) => {
  Blog.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/single-blog", (req, res) => {
  Blog.findById("5fc5ef9231715e0c20316e5c")
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});
*/

//middleware for static files
app.use(express.static("assets"));

//middleware for acepting form data
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

//Blog routes
app.get("/blogs", (req, res) => {
  Blog.find()
    .sort({ updatedAt: -1 })
    .then((result) => {
      res.render("index", {
        title: "All Blogs",
        blogs: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/blogs", (req, res) => {
  const blog = new Blog(req.body);
  blog
    .save()
    .then((result) => {
      res.redirect("/blogs");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/blogs/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  Blog.findById(id)
    .then((result) => {
      res.render("details", { blog: result, title: "Blog Details" });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.delete("/blogs/:id", (req, res) => {
  const id = req.params.id;

  Blog.findByIdAndDelete(id)
    .then((result) => {
      response.json({ redirect: "/blogs" });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/blog/create", (req, res) => {
  res.render("create", { title: "Create Blog" });
});

//404 page; Must stay at Bottom!
app.use((req, res) => {
  res.status(404).render("404", { title: "404: Page not found" });
});
