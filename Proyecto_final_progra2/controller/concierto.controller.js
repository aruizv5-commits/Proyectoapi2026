// importamos db los modelos en este caso si tenemos uno o mas, se puede referenciar db."nombreModelo".   
const db = require("../models");
const Concierto = db.concierto;
const Artista = db.artista;
const Op = db.Sequelize.Op;

// Create and Save a new Client
exports.create = async (req, res) => {
    // Validamos que dentro del  request no venga vacio el nombre, de lo contrario returna error
    if (!req.body.titulo_evento) {
        res.status(400).send({
            message: "Content can not be empty! concierto"
        });
        return;
    }

    if (!req.body.fecha_concierto) {
            return res.status(400).send({
                message: "La fecha del concierto es obligatoria."
            });
        }

           
    const parts = req.body.fecha_concierto.split('-'); 
    const FechaConcierto = new Date(parts[0], parts[1] - 1, parts[2]);

    
    const Ahorita = new Date();
    Ahorita.setHours(0, 0, 0, 0);

    if (isNaN(FechaConcierto.getTime())) {
            return res.status(400).send({
                message: "El formato de la fecha del concierto es inválido."
            });
        }

    if(FechaConcierto < Ahorita){

       return res.status(400).send({

            message: "No se admiten fechas anteriores a la del presente"
        });
        
    }
    // verifica si existe el artista
    const ArtistaID =await Artista.findByPk(req.body.id_artista);
    
    

       if(!ArtistaID){

        res.status(404).send({
            message: "esa Artista no existe"
        });
        return;
    }
    

    
    // verifica si existe un cocierto con las mismas caracteristicas
    const ConsiertoExiste = await Concierto.findOne({

        where:{

            id_artista: req.body.id_artista,
            recinto: req.body.recinto,
            ciudad: req.body.ciudad,
            fecha_concierto: req.body.fecha_concierto,
        }
    });

    if(ConsiertoExiste){

        res.status(400).send({
            message: "ese concierto no es posible"
        });
        return;
    }


    const conciertoOB = {
        id_artista: req.body.id_artista,
        titulo_evento: req.body.titulo_evento, 
        recinto: req.body.recinto,
        ciudad: req.body.ciudad,
        estado: req.body.estado,
        tipo_evento: req.body.tipo_evento,
        fecha_concierto: req.body.fecha_concierto,
        horario: req.body.horario

    };

 
    
    Concierto.create(conciertoOB)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Client."
            });
        });
};

// cambiar para que diga titulo
exports.findAll = (req, res) => {
    const nombre = req.query.titulo;
    var condition = nombre ? { nombre: { [Op.iLike]: `%${nombre}%` } } : null;

    Concierto.findAll({ where: condition })
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

    Concierto.findByPk(id).then(data => {res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Concierto with id=" + id
            });
        });
};

exports.BuscarNombre = async (req, res) => {

    try{
    const nombre = req.params.buscarNombre;
    const artista = await Artista.findAll({
            where: {
                nombre_artistico: {
                    [Op.iLike]: `%${nombre.trim()}%` 
                }
            }
        });


        if(!artista || artista.length === 0){

        res.status(404).send({
            message: "esa no hay artista llamado: "+nombre
        });
        return;
    }

    const artistasIds = artista.map(art => art.id_artista);

    const ID = await Concierto.findAll({where: {
                id_artista: {
                    [Op.in]: artistasIds 
                },
                estado: "activo" 
            }
        });

        if (!ID || ID.length === 0) {
            return res.status(404).send({
                message: "Se encontró al artistapero no tiene conciertos activos registrados."
            });
        }

    res.status(200).send(ID);

    } catch(err){

        res.status(500).send({
            message: "error al buscar artista "
        });
    }
};

exports.BuscarEvento = async (req, res) => {

    try{
    const evento = req.params.buscarEvento;;
    const evntos = await Concierto.findAll({where: {
                tipo_evento: {
                    [Op.iLike]: `%${evento.trim()}%`
                },
                estado: "activo"
            }
        });

        

        if(!evntos || evntos.length === 0){

        res.status(404).send({
            message: "esa no hay eventos: "+evento
        });
        return;
    }

    res.status(200).send(evntos);

    } catch(err){

        res.status(500).send({
            message: "error al buscar ese evento "
        });
    }
};

exports.BuscarFecha = async (req, res) => {

    try{
    const fecha = req.params.BuscarFecha;
    if (!fecha) {
            return res.status(400).send({
                message: "Debe proporcionar el parámetro 'fecha_concierto' para realizar la búsqueda."
            });
        }
  
        const inicioDia = new Date(`${fecha}T00:00:00.000Z`);
        const finDia = new Date(`${fecha}T23:59:59.999Z`);

        if (isNaN(inicioDia.getTime())) {
            return res.status(400).send({
                message: "Formato de fecha inválido. Use el formato YYYY-MM-DD (ej: 2026-11-15)."
            });
        }
 
        const evntos = await Concierto.findAll({
            where: {
                fecha_concierto: {
                    [Op.between]: [inicioDia, finDia]
                },
                estado: "activo" 
            }
        });

        if(!evntos || evntos.length === 0){

        res.status(404).send({
            message: "esa no hay una actividad planificada para esa fecha"
        });
        return;
    }

    res.status(200).send(evntos);

    } catch(err){

        res.status(500).send({
            message: "error al buscar ese evento "
        });
    }
};

// Update a Tutorial by the id in the request
exports.update = async(req, res) => {
    const id = req.params.id;

      const ConsiertoExiste = await Concierto.findOne({
            where: {
                id_concierto: { [Op.ne]: id }, 
                id_artista: req.body.id_artista,
                recinto: req.body.recinto,
                ciudad: req.body.ciudad,
                fecha_concierto: req.body.fecha_concierto,
            }
        });

    if(ConsiertoExiste){

        res.status(400).send({
            message: "ese concierto no es posible"
        });
        return;
    }

    const FechaConcierto = new Date(req.body.fecha_concierto);

    const Ahorita = new Date();

    if(FechaConcierto < Ahorita){

        res.status(400).send({

            message: "No se admiten fechas anteriores a la del presente"
        });
        return;
    }

    Concierto.update(req.body, {
        where: { id_concierto: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Concierto was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Client with id=${id}. Maybe Client was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Client with id=" + id
            });
        });
};

// Delete a Client with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    // utilizamos el metodo destroy para eliminar el objeto mandamos la condicionante where id = parametro que recibimos 
    Concierto.destroy({
        where: { id_concierto: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Client was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Client with id=${id}. El Concierto no fue encontado!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Tutorial with id=" + id
            });
        });
};

// Delete all Clients from the database.
exports.deleteAll = (req, res) => {
    Concierto.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Clients were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all clients."
            });
        });
};

