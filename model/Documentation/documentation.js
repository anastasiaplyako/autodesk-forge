const {Schema, model, Types} = require("mongoose");

const schema = new Schema({
    originalName: {type: String},
    keyAWS: {type: String},
    idProject: {type: Types.ObjectId, ref: 'Projects'},
    url:  {type: String},
})

module.exports = model("Documentation", schema)