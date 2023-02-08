const mongoose = require("mongoose")

let receitaSchema = new mongoose.Schema({
    receita : Number,
    created_at: {type: Date, default: Date.now},
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model("Receita", receitaSchema)