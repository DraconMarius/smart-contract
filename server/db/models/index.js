const Net = require("./net");
const Entry = require("./entry");


Net.hasMany(Entry, {
    foreignKey: "net_id"
});

Entry.belongsTo(Net, {
    foreignKey: "net_id",
});


module.exports = { Net, Entry };