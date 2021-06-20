const {Schema, model, Types} = require("mongoose");

const schema = new Schema({
    nameFolder: {type: String},
    idProject: {type: Types.ObjectId, ref: 'Projects'}
})

module.exports = model("Folders", schema)