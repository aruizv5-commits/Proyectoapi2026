module.exports = app => {
    const concierto = require("../controller/concierto.controller.js");
    var router = require("express").Router();
    
    router.post("/create/", concierto.create);
    
    router.get("/", concierto.findAll);
    
   router.get("/nombre/:buscarNombre", concierto.BuscarNombre);
   router.get("/evento/:buscarEvento", concierto.BuscarEvento);
    router.get("/fecha/:BuscarFecha", concierto.BuscarFecha);

    router.get("/:id", concierto.findOne);
   
    router.put("/update/:id", concierto.update);
   
    router.delete("/delete/:id", concierto.delete);

    router.delete("/delete/", concierto.deleteAll);

    app.use("/api/concierto", router);
};