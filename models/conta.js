const mongoose = require("mongoose");

let contasSchema = new mongoose.Schema({
    title: String,
    price: Number,
    desFixo: false,
    created_at: {type: Date, default: Date.now},
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

module.exports = mongoose.model("Contas", contasSchema)