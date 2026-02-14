const { default: mongoose } = require("mongoose")
const { Schema } = mongoose;
const CounterSchema = new Schema({
    model: {
        type: String,
        required: true
    },
    count: {
        type: Number,
    },
}, {
    timestamps: true
});


const CounterModel = mongoose.model("CounterModel", CounterSchema,"counters");
module.exports = CounterModel;