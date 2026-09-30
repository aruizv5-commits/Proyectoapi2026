
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));


app.use(bodyParser.json());


app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./Proyecto_final_progra2/models");
db.sequelize.sync();

app.get("/", (req, res) => {
  res.json({ message: "UMG Web Application" });
});

//require("./app/routes/turorial.routes")(app);
require("./Proyecto_final_progra2/route/artista.route")(app);
require("./Proyecto_final_progra2/route/concierto.route")(app);
require("./Proyecto_final_progra2/route/inventario_boletos.route")(app);
require("./Proyecto_final_progra2/route/detalle_ventas.route")(app);
require("./Proyecto_final_progra2/route/localidades.route")(app);
require("./Proyecto_final_progra2/route/usuario.route")(app);
require("./Proyecto_final_progra2/route/ventas.route")(app);
require("./Proyecto_final_progra2/route/cliente.route")(app);
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});