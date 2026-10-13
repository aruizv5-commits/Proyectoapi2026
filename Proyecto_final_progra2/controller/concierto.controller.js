// importamos db los modelos en este caso si tenemos uno o mas, se puede referenciar db."nombreModelo".   
const db = require("../models");
const Concierto = db.concierto;
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

    // verifica si existe el artista
    const ArtistaID =await db.artista.findByPk(req.body.id_artista);

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
        id_concierto: req.body.id_concierto,
        id_artista: req.body.id_artista,
        titulo_evento: req.body.titulo_evento, 
        recinto: req.body.recinto,
        ciudad: req.body.ciudad,
        estado: req.body.estado,
        tipo_evento: req.body.tipo_evento,
        fecha_concierto: req.body.fecha_concierto,
        horario: req.body.horario

    };

    //valida que la fecha sea no sea anterior a la actual
    const FechaConcierto = new Date(req.body.fecha_concierto);

    const Ahorita = new Date();

    if(FechaConcierto < Ahorita){

        res.status(400).send({

            message: "No se admiten fechas anteriores a la del presente"
        });
        return;
    }


    
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

    Concierto.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Concierto with id=" + id
            });
        });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

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

