module.exports = app => {
    const inventario_boletos = require("../controller/inventario_boletos.controller.js");
    var router = require("express").Router();
    
    router.post("/create/", inventario_boletos.create);
    
    router.get("/", inventario_boletos.findAll);
    
   

    router.get("/:id", inventario_boletos.findOne);
   
    router.put("/update/:id", inventario_boletos.update);
   
    router.delete("/delete/:id", inventario_boletos.delete);

    router.delete("/delete/", inventario_boletos.deleteAll);

    app.use("/api/inventario_boletos", router);
};