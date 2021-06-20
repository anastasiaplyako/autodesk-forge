const {Schema, model, Types} = require("mongoose");

const schema = new Schema({
    idBucket: {type: String},
    nameBucket: {type: String},
    idOwner: {type: Types.ObjectId, ref: 'User'}
})

module.exports = model("Bucket", schema)