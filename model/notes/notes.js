const {Schema, model, Types} = require("mongoose");

const schema = new Schema({
    note: {type: String},
    idFolder: {type: Types.ObjectId, ref: 'Folders'},
})

module.exports = model("Note", schema)