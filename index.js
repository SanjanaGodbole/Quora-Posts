//Basic code for creating web server
const express=require("express");
const { request } = require("http");
const app=express();
const port=8080;
//to use public & views folders inside index.js
const path=require ("path");

//Creation of unique ids v4-version 4
const { v4: uuidv4 } = require('uuid');

var methodOverride=require("method-override");

//middle wear to pass encoded data by express
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

//telling express/app, methodOverride is getting used and track
//whether query string is having _ (action="/posts/<%=post.id%>?_method=PATCH") or not
app.use(methodOverride('_method'))

//setting up view engine(template engine),
app.set("view engine","ejs");

//view engine will look for views/templates in view folders only 
// irrespective of where Server is running
app.set("views",path.join(__dirname,"views"));

//middle wear-Public folder will serve all static files(css,js) to
//Path setting for pulic folder so server can be started from any folder
app.use(express.static(path.join(__dirname,"public/css")))
app.use(express.static(path.join(__dirname,"public/js")))




//if we declare this const, delete operation will be difficult
let posts=[
    {
        // id:"1a",
        id:uuidv4(),
        username:"Sanjana Godbole",
        content:"I love Coding",
    },
    {
        id:uuidv4(),
        username:"Abhishek",
        content:"Hardworking is necessary"
    },
    {    id:uuidv4(),
        username:"Anushka",
        content:"Selected for my first internship"
    }

]



//Basic path(route) creation
// app.get("/",(req,res)=>{
//     res.send(console.log("Server working well"));
// })

//Index Route
app.get("/posts",(req,res)=>{
    res.render("index.ejs",{posts})
})

//Create Route
app.get("/posts/new",(req,res)=>{
    res.render("new.ejs")
})

app.post("/posts",(req,res)=>{
    console.log(req.body);
    let {username,content}=req.body;
    let id= uuidv4();
    posts.push({id,username,content});
     //res.send("Post request working");
     res.redirect("/posts");  
})

//View Route(Single post using id)
app.get("/posts/:id",(req,res)=>{
let {id}=req.params;
// console.log(id);
let post=posts.find((p)=>id===p.id);
// console.log(post);
// res.send("Post request working");
res.render("show.ejs",{post})
})

//edit route
app.get("/posts/:id/edit",(req,res)=>{
    let {id}=req.params; 
    let post=posts.find((p)=>id===p.id);
    // console.log("Edit route",id)
    res.render("edit.ejs",{post})
})


//Update route - not working using https://hoppscotch.io/
app.patch("/posts/:id",(req,res)=>{
     let {id}=req.params;
     let newContent=req.body.content;
     let post=posts.find((p)=>id===p.id);
     post.content=newContent;
    //  console.log("Patch request success",newContent);
    //  res.send("Patch request working");
    res.redirect("/posts"); 

})

//Delete route
app.delete("/posts/:id",(req,res)=>{
    let {id}=req.params; 
     posts=posts.filter((p)=>id!=p.id);
     res.redirect("/posts");  
})



app.listen(port,()=>{
    console.log(`Listening to port ${port}`)
})



