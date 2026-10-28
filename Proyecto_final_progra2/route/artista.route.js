module.exports = app => {
    const artista = require("../controller/artista.controller.js");
    var router = require("express").Router();
    
    router.post("/create/", artista.create);
    
    router.get("/", artista.findAll);
    
    router.get("/nombre/:BuscarNombre", artista.BuscarNombre);
    router.get("/genero/:buscarGenero", artista.BuscarGeneroMusical);
    router.get("/pais/:BuscarPais", artista.BuscarPais);

    router.get("/:id", artista.findOne);
   
    router.put("/update/:id", artista.update);
   
    router.delete("/delete/:id", artista.delete);

    

    app.use("/api/artista", router);
};