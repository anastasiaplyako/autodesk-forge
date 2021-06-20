const {Schema, model, Types} = require("mongoose");

const schema = new Schema({
    idBucket: {type: Types.ObjectId, ref: 'Bucket'},
    idUser: {type: Types.ObjectId, ref: 'User'}
})

module.exports = model("user-bucket", schema)