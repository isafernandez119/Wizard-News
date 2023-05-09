const express = require("express");
const morgan = require("morgan");
const postBank = require("./postBank");
const app = express();
app.use(morgan("dev"));
app.use(express.static("public"));

app.get("/", (req, res) => {
  const posts = postBank.list();

  const html = `<DOCTYPE html>
  
     <html>
     
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      ${posts
        .map(
          (post) => `
        <div class='news-item'>
        <a href="/posts/${post.id}">${post.title}</a>
          <p>
            <span class="news-position">${post.id}. ▲</span>
            ${post.title}
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
        </div>`
        )
        .join("")}
    </div>
  </body>
</html>`;
  res.send(html);
});

app.get("/public", (req, res) => {});

app.get("/posts/:id", (req, res) => {
  const id = req.params.id;
  const post = postBank.find(id);
  if (!post.id) {
    // If the post wasn't found, just throw an error
    throw new Error("Not Found");
  }
  res.send(`<html>
  
    <title>Wizard News</title>
  <body>
   <link rel="stylesheet" href="/style.css" />
    <div class="news-list">
  <header><img src="/logo.png"/>Wizard News</header>
   <div class='news-item'>
  <p>
            <span class="news-position">${post.id}. ▲</span>
            ${post.title}
            <small>(by ${post.name})</small>
            <body>
            ${post.content}
              <body>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
          <>
<div>
 <body>
  <html>`);
});

const { PORT = 1337 } = process.env;

app.listen(PORT, (req, res) => {
  console.log(`App listening in port ${PORT}`);
});
