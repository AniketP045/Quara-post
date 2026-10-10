const express = require("express");
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const methodOverride = require("method-override")


const app = express();
const port = 9000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // useful if you'll accept JSON requests

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// serve static files from ./public
app.use(express.static(path.join(__dirname, "public/images")));
app.use(express.static(path.join(__dirname, "public")));

let posts = [
  {
    id: uuidv4(),
    username: "Darshan",
    content: "Full stack devloper",
    image: "/images/m.png",
  


  },
  {
    id: uuidv4(),
    username: "Sam",
    content: "Python Developer",
    image: "/images/f.png",
  },
  {
    id: uuidv4(),
    username: "Sushant",
    content: "Backend Developer",
    image: "/images/m.png",

  },
]

app.get("/posts", (req, res) => {
  res.render("index.ejs", { posts })
});
//here created new post form 
app.get("/posts/new", (req, res) => {
  res.render("new.ejs")
})
//here get all the new post and older post
app.post("/posts", (req, res) => {
  let id = uuidv4()
  let { username, content, image } = req.body
  posts.push({ username, content,id, image })
  //redirect used to connect two routes
  res.redirect("/posts")
})

//to update particular post of content
app.patch("/posts/:id",(req,res)=>{
  let { id } = req.params;
  console.log(id);
 
  let newcontent= req.body.content;
  let post= posts.find((p)=> p.id===id)
  post.content=newcontent;

  console.log(post);
  res.redirect("/posts")
})

app.patch("/posts/upload/:id",(req,res)=>{
   let { id } = req.params;
   console.log(id);
   let post= posts.find((p)=> p.id===id)
   console.log("before :", post)

    let newImg = req.body.image
      if(post){
        post.image = newImg
     
        console.log("Updated post:", post)

      }
      res.render("img.ejs",{post})

     
})

//to show edit form of particular post
app.get("/posts/:id/edit",(req,res)=>{
  let { id } = req.params;
  let post= posts.find((p)=> p.id===id)
  console.log(id)
  res.render("edit.ejs",{post})
})  

//to show details of particular post
app.get("/posts/:id", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => id === p.id)
  res.render("show.ejs", { post })
  if (!post) {
    res.render("error.ejs")
  }
})

//to delete perticular post
app.delete("/posts/:id",(req,res)=>{
   let { id } = req.params;
   posts = posts.filter((p) => id !== p.id)
   res.redirect("/posts")
})

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

