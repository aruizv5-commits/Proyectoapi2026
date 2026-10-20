module.exports = app => {
    const localidades = require("../controller/localidades.controller.js");
    var router = require("express").Router();
    
    router.post("/create/", localidades.create);
    
    router.get("/", localidades.findAll);
    
    router.get("/:id", localidades.findOne);
   


    app.use("/api/localidades", router);
};