module.exports = app => {
    const localidades = require("../controller/localidades.controller.js");
    var router = require("express").Router();
    
    router.post("/create/", localidades.create);
    
    router.get("/", localidades.findAll);
    
    router.get("/status", localidades.findAllStatus);

    router.get("/:id", localidades.findOne);
   
    router.put("/update/:id", localidades.update);
   
    router.delete("/delete/:id", localidades.delete);

    router.delete("/delete/", localidades.deleteAll);

    app.use("/api/localidades", router);
};