const express = require('express');
const path = require('path');
const app = express();
const { projects } = require('./data.json');
const port = 3000;

app.set("view engine", "pug");

app.use("/static", express.static("./public"));

app.get("/", (req, res)=>{
    res.locals.projects = projects;
    res.render("index");
});

app.get("/projects/:id", (req, res, next)=>{
    if (projects[req.params.id]) {
        res.locals.project = projects[req.params.id];
        res.render("project");
    } else {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    }
});

app.get("/about", (req, res)=>{
    res.render("about");
});

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});
  
app.use((err, req, res, next) => {
    res.locals.error = err;
    res.status(err.status);
    res.render('error');
});

app.listen(port, ()=>{
    console.log(`The application is running on port ${port}`);
});