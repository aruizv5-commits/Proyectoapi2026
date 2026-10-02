module.exports = app => {
    const artista = require("../controller/artista.controller.js");
    var router = require("express").Router();
    
    router.post("/create/", artista.create);
    
    router.get("/", artista.findAll);
    
  

    router.get("/:id", artista.findOne);
   
    router.put("/update/:id", artista.update);
   
    router.delete("/delete/:id", artista.delete);

    router.delete("/delete/", artista.deleteAll);

    app.use("/api/artista", router);
};