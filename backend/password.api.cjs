const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const passwordModel = require('./db/password.model.cjs');

router.post('/store', async function(request, response) {
    const requestBody = request.body;
    const username = requestBody.username;
    const url = requestBody.url;
    const password = requestBody.password;

    const newPassword = {
        username: username,
        url: url,
        password: password
    };

    try {
        const createPasswordResponse = await passwordModel.insertPassword(newPassword);
        return response.json(createPasswordResponse);
    } catch (error) {
        response.status(400);
        return response.send('Failed to store password.');
    }
});

router.get('/list', async function(request, response) {
    const username = request.query.username;

    try {
        const passwords = await passwordModel.getPasswordByUser(username);
        return response.send(passwords);
    } catch (error) {
        response.status(400);
        return response.send('Failed to retrieve passwords.');
    }
});

router.delete('/delete/:passwordId', async function(request, response) {
    const passwordId = request.params.passwordId;

    try {
        const deletedPassword = await passwordModel.deletePassword(passwordId);
        if (!deletedPassword) {
            response.status(404);
            return response.send('Password not found.');
        }
        return response.send('Password deleted.');
    } catch (error) {
        response.status(400);
        return response.send('Failed to delete password.');
    }
});

module.exports = router;
