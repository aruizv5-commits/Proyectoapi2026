module.exports = (sequelize, Sequelize) =>{
    const Detalle_Ventas = sequelize.define("detalle_ventas", {
        id_detalle:{
            type: Sequelize.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        id_venta:{
            type: Sequelize.INTEGER,
            allowNull: false
        },
        id_inventario:{
            type: Sequelize.INTEGER,
            allowNull: false
        },
        id_cliente:{

            type: Sequelize.INTEGER,
            allowNull: false
        },
        cantidad:{
            type: Sequelize.INTEGER,
            allowNull: false
        },
        precio_unitario:{
            type: Sequelize.FLOAT,
            allowNull: false
        },
        subtotal:{
            type: Sequelize.FLOAT,
            allowNull: false
        }
    });
    return Detalle_Ventas;
}