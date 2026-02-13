const CounterModel=require('../models/counterModel')
const getNextSequenceCounter = async (sequenceName) => {
    const sequenceDocument = await CounterModel.findOneAndUpdate(
        { model: sequenceName },
        { $inc: { count: 1 } },
        { new: true, upsert: true }
    );
    return sequenceDocument.count;
}

module.exports = getNextSequenceCounter