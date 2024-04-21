const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const messageModel = require('./db/message.model.cjs');

router.post('/send', async function(request, response) {
    const requestBody = request.body;
    const receiver = requestBody.receiver;
    const sender = requestBody.sender;
    const accepted = requestBody.accepted;

    const newMessage = {
        receiver: receiver,
        sender: sender,
        accepted: accepted
    };

    try {
        const createMessageResponse = await messageModel.insertMessage(newMessage);
        return response.json(createMessageResponse);
    } catch (error) {
        response.status(400);
        return response.send('Failed to send message.');
    }
});

router.get('/receive', async function(request, response) {
    const receiver = request.query.receiver;

    try {
        const messages = await messageModel.getMessageByReceiver(receiver);
        return response.send(messages);
    } catch (error) {
        response.status(400);
        return response.send('Failed to retrieve messages.');
    }
});

router.get('/share', async function(request, response) {
    const receiver = request.query.receiver;

    try {
        const messages = await messageModel.sharedUser(receiver);
        return response.send(messages);
    } catch (error) {
        response.status(400);
        return response.send('Failed to retrieve messages.');
    }
});

router.delete('/clear/:messageId', async function(request, response) {
    const messageId = request.params.messageId;

    try {
        const deletedMessage = await messageModel.deleteMessage(messageId);
        if (!deletedMessage) {
            response.status(404);
            return response.send('Message not found.');
        }
        return response.send('Message deleted.');
    } catch (error) {
        response.status(400);
        return response.send('Failed to delete message.');
    }
});

router.put('/accept/:messageId', async function(request, response) {
    const messageId = request.params.messageId;

    try {
        const messageUpdateResponse = await messageModel.acceptMessage(messageId);
        return response.send('Successfully accept the share request.')
    } catch (error) {
        response.status(400);
        return response.send(error);
    }
})

module.exports = router;
