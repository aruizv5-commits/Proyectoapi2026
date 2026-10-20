module.exports = (sequelize, Sequelize) => {
    const localidad = sequelize.define("localidad", {
        id_localidad: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        nombre: {
            type: Sequelize.STRING,
            allowNull: false
        },
        asiento: {
            type: Sequelize.STRING,
            allowNull: false
        },
        estado: {
            type: Sequelize.BOOLEAN
        }
    }, {
        tableName: "localidads",
        freezeTableName: true
    });

    return localidad;
};