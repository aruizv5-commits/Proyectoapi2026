// importamos db los modelos en este caso si tenemos uno o mas, se puede referenciar db."nombreModelo".   
const db = require("../models");
const Localidad = db.localidades;
const I_boletos = db.i_boletos;
const Op = db.Sequelize.Op;

// Create and Save a new Client
exports.create = async (req, res) => {
    // Validamos que dentro del  request no venga vacio el nombre, de lo contrario returna error
    if (!req.body.id_concierto || !req.body.precio ) {
        res.status(400).send({
            message: "el precio o concierto no deben ir vacios"
        });
        return;
    }

    try{

        const conciertoID = await db.concierto.findByPk(req.body.id_concierto);
        
    
              if(!conciertoID){

        res.status(404).send({
            message: "ese concierto no existe"
        });
        return;
    }

    const Totalfila = 10;
    const Asintoporfila = 10;
  let listaAsientos = [];
  const totalAsientos= Totalfila * Asintoporfila;

  const porVIP = 0.10;
  const porPlata = 0.20;

  const limVip = Math.floor(totalAsientos * porVIP);
  const limPlata = limVip + Math.floor(totalAsientos* porPlata);

  const LetraAsiento = ['A','B','C','D','E','F','G','H','I','J'];
  let contadorAsiento = 0;



  for(let i = 0; i < Totalfila; i++){

    const letraFila = LetraAsiento[i];

    for(let a = 1; a <= Asintoporfila; a++){


        contadorAsiento++;

                
                let nombreLocalidad = "";
                if (contadorAsiento <= limVip) {
                    nombreLocalidad = "VIP";
                } else if (contadorAsiento <= limPlata) {
                    nombreLocalidad = "Plata";
                } else {
                    nombreLocalidad = "General";
                }
                
        listaAsientos.push({
        
        nombre: nombreLocalidad,
        asiento: `${letraFila}-${a}`,
        estado: req.body.status ? req.body.status : false
        });
    }
  }


    
    const localidadesCreadas = await Localidad.bulkCreate(listaAsientos, { returning: true });

    let inventarioInsertar = localidadesCreadas.map(cod =>{
        return{

            id_concierto: req.body.id_concierto,
            id_localidad: cod.id_localidad,
            precio: req.body.precio,
            cantidad_total: 1,
            cantidad_disponible: 1
        };
    });

    const InventarioCreado = await I_boletos.bulkCreate(inventarioInsertar);

        return res.status(201).send({
            message: "Se crearon exitosamente los asientos.",
            
        });
    // Save a new Client into the database
    } catch(err) {
            res.status(500).send({
                message: "error al crear los asientos"
            });
        };
    
};

// Retrieve all Client from the database.
exports.findAll = (req, res) => {
    const nombre = req.query.nombre;
    var condition = nombre ? { nombre: { [Op.iLike]: `%${nombre}%` } } : null;

    Localidad.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving clients."
            });
        });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Localidad.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Localidad with id=" + id
            });
        });
};


