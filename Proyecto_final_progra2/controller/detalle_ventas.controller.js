// importamos db los modelos en este caso si tenemos uno o mas, se puede referenciar db."nombreModelo".   
const db = require("../models");
const transporter = require("../config/mailer");
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const Detalle_ventas = db.d_ventas;
const Op = db.Sequelize.Op;


const accountTransport = require("../config/account_transport.json");



const _SERVER = "http://localhost:8081"; 
const _ID_APP_1 = 1;                      
const head = "<div style='background:#333;color:#fff;padding:10px;'>Encabezado</div>";                          
const footer = "<div style='font-size:12px;color:#777;'>Pie de página</div>";

const mail_rover = async (callback) => {
    const oauth2Client = new OAuth2(
        accountTransport.auth.clientId,
        accountTransport.auth.clientSecret,
        "https://developers.google.com/oauthplayground",
    );
    oauth2Client.setCredentials({
        refresh_token: accountTransport.auth.refreshToken,
        tls: {
            rejectUnauthorized: false
        }
    });
    oauth2Client.getAccessToken((err, token) => {
        if (err)
            return console.log(err);;
        accountTransport.auth.accessToken = token;
        callback(nodemailer.createTransport(accountTransport));
    });
};

// Create and Save a new Client
exports.create = async (req, res) => {
    try {
    if (!req.body.id_venta) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
//otras cosas que no me recuerdo bien pero son importantes
    const ventaID = await db.ventas.findByPk(req.body.id_venta);
    const clienteID = await db.cliente.findByPk(req.body.id_cliente);
    const Ventaexiste = await Detalle_ventas.findOne({where:{id_venta: req.body.id_venta}})
    
    const id_inventarios =  req.body.id_inventario;
    
    //valida que existan las id
        if(!ventaID){

        res.status(404).send({
            message: "esa venta no existe"
        });
        return;
    }

    if(Ventaexiste){
        res.status(400).send({
            message: "esa venta no es posible"
        });
        return;
    }

        if(!clienteID){

        res.status(404).send({
            message: "no existe dicho cliente"
        });
        return;
    }

    if(!Array.isArray(id_inventarios) || id_inventarios.length === 0){
        res.status(404).send({
            message: "tiene que enviar el numero de inventario"
        });
        return;
    }


    const ids_inventarios = id_inventarios;
    let detallesAInsertar = [];
    let Totalgeneral=0;

    //calculos 
    
for (let idInv of ids_inventarios) {
            const inventarioID = await db.i_boletos.findByPk(idInv);
            
            if (!inventarioID) {
                return res.status(404).send({ message: `El boleto de inventario con ID ${idInv} no existe.` });
            }

            const LocalidadID = await db.localidades.findByPk(inventarioID.id_localidad);
            const conciertoID = await db.concierto.findByPk(inventarioID.id_concierto);

        if(conciertoID.estado ==="finalizado" || conciertoID.estado ==="Cancelado" ){

        return res.status(400).send({
            message: "ese concierto no se puedeen vender boletos"
        });
        
    }

    if(!LocalidadID.estado){

         return res.status(400).send({
            message: "ese asiento no esta disponible "
        });
        
    }

    const preciosN = inventarioID.precio;
    const nombreLocalidad = LocalidadID.nombre ? LocalidadID.nombre.trim() : "";
    let totalpagar = 0;

    if (nombreLocalidad === "VIP") {
        const precios = preciosN * 0.45;
        totalpagar = preciosN + precios;
    } else if (nombreLocalidad === "Plata") {
        const precios = preciosN * 0.25;
        totalpagar = preciosN + precios;
    } else {
        totalpagar = preciosN;
    }

    Totalgeneral += totalpagar;
  

detallesAInsertar.push({
                datosDetalle: {
                    id_venta: req.body.id_venta,
                    id_inventario: inventarioID.id_inventario,
                    id_cliente: req.body.id_cliente,
                    asiento: LocalidadID.asiento,
                    cantidad: 1, 
                    precio_unitario: totalpagar,
                    subtotal: totalpagar
                },
                localidadModel: LocalidadID,
                inventarioModel: inventarioID,
                conciertoModel: conciertoID
            });
        
        }

        let resultados = [];
        for (let item of detallesAInsertar) {
            const nuevoDetalle = await Detalle_ventas.create(item.datosDetalle);
            resultados.push(nuevoDetalle);

            await item.localidadModel.update({ estado: false });

            const nuevoStock = item.inventarioModel.cantidad_disponible - 1;
            await item.inventarioModel.update({ cantidad_disponible: nuevoStock });

            const inventariosRestantes = await db.i_boletos.count({
                where: {
                    id_concierto: item.conciertoModel.id_concierto,
                    cantidad_disponible: { [Op.gt]: 0 } 
                }
            });

            if (inventariosRestantes === 0) {
                await item.conciertoModel.update({ estado: "Agotado" });
            }
        }

        const Nuevototal = Number(ventaID.total_venta || 0) + Totalgeneral;

        await ventaID.update({total_venta:Nuevototal});

        //envia el piche correo
       if (clienteID && clienteID.correo) {
            
            // Llamamos a tu función mail_rover pasándole el transporter
            mail_rover(1, async (transporterConfig) => {
                
                // Aquí defines el ID de la app o de la configuración que necesites (ej: _ID_APP_1)
                const idAppConfig = _ID_APP_1; 

                // Si tu mail_rover espera recibir el id o ya lo maneja internamente:
                // (Adaptado a la estructura JSON que regresa tu switch)
                const jsonConfig = {
                    url: _SERVER + 'check/', 
                    mail: transporterConfig, 
                    app: 'CHECK', 
                    from: 'Check <check@planck.biz>',
                    to: clienteID.correo, // 👈 IMPORTANTE: Aquí va el correo dinámico del cliente que compró
                    slogan: '😋 Comida exquisita, entregas simples. 🛵 Compra YA! 👇🏻',
                    body_bienvanida: 'Mensaje personalizado', 
                    head_bienvanida: 'En Check pide a tu local favorito, o chatea con un asesor por medicina, y te lo llevamos lo antes posible.',
                    bcc: 'Info <planck.biz@gmail.com>', 
                    head: typeof head !== 'undefined' ? head : '', 
                    footer: typeof footer !== 'undefined' ? footer : ''
                };

                const mailOptions = {
                    from: jsonConfig.from,
                    to: jsonConfig.to,
                    bcc: jsonConfig.bcc,
                    subject: "¡Confirmación de compra de boletos!",
                    html: `
                        <h2>¡Gracias por tu compra, ${clienteID.nombre || 'Cliente'}!</h2>
                        <p>${jsonConfig.head_bienvanida}</p>
                        <p>Tu transacción se ha procesado con éxito en nuestro sistema.</p>
                        <p><b>Número de Venta:</b> #${ventaID.id_venta}</p>
                        <p><b>Total General:</b> $${Totalgeneral}</p>
                        <br>
                        <p><i>${jsonConfig.slogan}</i></p>
                        <p>¡Te esperamos en el evento!</p>
                    `
                };

                try {
                    await jsonConfig.mail.sendMail(mailOptions);
                    console.log("Correo de confirmación enviado exitosamente mediante mail_rover.");
                } catch (mailErr) {
                    console.error("No se pudo enviar el correo con mail_rover, pero la venta se registró:", mailErr);
                }
            });
        }

    //aqui termina la operacion para el pinche correo y sigue las demas babosadas
   return res.status(201).send(resultados);

    } catch (err) {
        return res.status(500).send({
            message: err.message || "Hubo un error al guardar el detalle de ventas."
        });
    }
};


// Retrieve all Client from the database.
exports.findAll = (req, res) => {
    const nombre = req.query.id_detalle;
    var condition = nombre ? { nombre: { [Op.iLike]: `%${nombre}%` } } : null;

    Detalle_ventas.findAll({ where: condition })
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

    Detalle_ventas.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Detalle_ventas with id=" + id
            });
        });
};






// Delete a Client with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    // utilizamos el metodo destroy para eliminar el objeto mandamos la condicionante where id = parametro que recibimos 
    Detalle_ventas.destroy({
        where: { id_detalle: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Client was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Client with id=${id}. El Detalle_ventas no fue encontado!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Tutorial with id=" + id
            });
        });
};


