
module.exports = (sequelize, Sequelize) => {

    const Ventas = sequelize.define("ventas", {
        id_venta: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true
        },
        id_vendedor: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        fecha_venta: {
            type: Sequelize.DATE,
            allowNull: false
        },
        total_venta: {
            type: Sequelize.FLOAT,
            allowNull: false
        }
    });
    return Ventas;
};