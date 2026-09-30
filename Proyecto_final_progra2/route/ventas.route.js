module.exports = app => {
    const ventas = require("../controller/ventas.controller.js");
    var router = require("express").Router();
    
    router.post("/create/", ventas.create);
    
    router.get("/", ventas.findAll);
    
    router.get("/status", ventas.findAllStatus);

    router.get("/:id", ventas.findOne);
   
    router.put("/update/:id", ventas.update);
   
    router.delete("/delete/:id", ventas.delete);

    router.delete("/delete/", ventas.deleteAll);

    app.use("/api/ventas", router);
};