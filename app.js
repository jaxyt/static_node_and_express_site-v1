const express = require('express');
const app = express();
const { projects } = require('./data.json');
const port = 3000;

/**Lets express know to render the web pages using the pug templates in the default views folder */
app.set("view engine", "pug");

/**Serves all the static images/css/js files when the static route is invoked */
app.use("/static", express.static("./public"));

/**rendens the index pug template */
app.get("/", (req, res)=>{
    res.locals.projects = projects;
    res.render("index");
});

/**
 * When the projects route is called, express validates the projects id, and if it exists it renders the
 * corresponding page, otherwise it throws an error
 */
app.get("/projects/:id", (req, res, next)=>{
    if (projects[req.params.id]) {
        res.locals.project = projects[req.params.id];
        res.render("project");
    } else {
        const err = new Error('Not Found');
        err.status = 404;
        console.error(`${err.status} Error: The page you are looking for was ${err.message}`);
        next(err);
    }
});

/**renders the about page 
 * and handles first degree routing errors
*/
app.get("/:id", (req, res, next)=>{
    if (req.params.id === "about") {
        res.render("about");
    } else {
        const err = new Error('Not Found');
        err.status = 404;
        console.error(`${err.status} Error: The page you are looking for was ${err.message}`);
        next(err);
    }
});

/**
 *  handles any other routing errors
*/
app.get("/:id/:name", (req, res, next)=>{
    const err = new Error('Not Found');
    err.status = 404;
    console.error(`${err.status} Error: The page you are looking for was ${err.message}`);
    next(err);
});

/** renders the error page from the error.pug template */
app.use((err, req, res, next) => {
    res.locals.error = err;
    res.status(err.status);
    res.render('error');
});

/** starts up the local server */
app.listen(port, ()=>{
    console.log(`The application is running on port ${port}`);
})