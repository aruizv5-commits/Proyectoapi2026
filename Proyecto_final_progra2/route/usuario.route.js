module.exports = app => {
    const usuario = require("../controller/usuario.controller.js");
    var router = require("express").Router();
    
    router.post("/create/", usuario.create);
    
    router.get("/", usuario.findAll);
    
    router.get("/estado/:status", usuario.findAllStatus);

    router.get("/:id", usuario.findOne);
   
    router.put("/update/:id", usuario.update);
   
    router.delete("/delete/:id", usuario.delete);


    app.use("/api/usuario", router);
};