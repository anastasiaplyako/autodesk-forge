const {Schema, model, Types} = require("mongoose");

const schema = new Schema({
    idRole: {type: Types.ObjectId, ref: 'Roles'},
    idUser: {type: Types.ObjectId, ref: 'User'},
    idProject: {type: Types.ObjectId, ref: 'Projects'}
})

module.exports = model("UsersRole", schema)