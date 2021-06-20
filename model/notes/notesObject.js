const {Schema, model, Types} = require("mongoose");

const schema = new Schema({
    note: {type: String},
    idProject: {type: Types.ObjectId, ref: 'Project'},
    idNoteObject: {type: String},
})

module.exports = model("Notes_object", schema)