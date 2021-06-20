const {Schema, model, Types} = require("mongoose");

const schema = new Schema({
    nameRole: {type: String},
    idProject: {type: Types.ObjectId, ref: 'Projects'}
})

module.exports = model("Roles", schema)