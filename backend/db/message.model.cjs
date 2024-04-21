const model = require('mongoose').model;
const MessageSchema = require('./message.schema.cjs');

const MessageModel = model('message', MessageSchema);

function insertMessage(message) {
    return MessageModel.create(message);
}

function getMessageByReceiver(user) {
    return MessageModel.find({
        receiver: user,
        accepted: false
    }).exec();
}

function deleteMessage(messageId) {
    return MessageModel.deleteOne({_id: messageId})
}

function acceptMessage(messageId) {
    return MessageModel.findOneAndUpdate(
        { _id: messageId },
        { accepted: true },
        { new: true }
    );
}

function sharedUser(user) {
    return MessageModel.find({
        receiver: user,
        accepted: true
    }).exec();
}

module.exports = {
    insertMessage,
    getMessageByReceiver,
    deleteMessage,
    acceptMessage,
    sharedUser
}