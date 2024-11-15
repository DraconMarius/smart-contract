const Net = require("./net");
const Entry = require("./entry");
const Error = require("./error");


Net.hasMany(Entry, {
    foreignKey: "net_id"
});

Entry.belongsTo(Net, {
    foreignKey: "net_id",
});

Net.hasMany(Error, {
    foreignKey: "net_id"
});

Error.belongsTo(Net, {
    foreignKey: 'net_id',
});

module.exports = { Net, Entry, Error };