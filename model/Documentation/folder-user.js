const {Schema, model, Types} = require("mongoose");

const schema = new Schema({
    idRole: {type: Types.ObjectId, ref: 'Roles'},
    idFolder: {type: Types.ObjectId, ref: 'Folders'}
})

module.exports = model("Roles-folders", schema)