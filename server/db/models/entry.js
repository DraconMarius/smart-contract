const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Entry extends Model { }

Entry.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    net_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "net",
            key: "id",
        },
    },
    tx_hash: {
        type: DataTypes.STRING(2000),
        allowNull: false,
    },
    start_time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end_time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    write_latency: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    read_latency: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    caller: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    underscored: true,
    freezeTableName: true,
    modelName: "entry",
});

module.exports = Entry;