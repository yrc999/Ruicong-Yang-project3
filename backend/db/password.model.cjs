const model = require('mongoose').model;
const PasswordSchema = require('./password.schema.cjs');

const PasswordModel = model('Password', PasswordSchema);

function insertPassword(password) {
    return PasswordModel.create(password);
}

function getPasswordByUser(user) {
    return PasswordModel.find({
        username: user
    }).exec();
}

function deletePassword(passwordId) {
    return PasswordModel.deleteOne({_id: passwordId})
}

module.exports = {
    insertPassword,
    getPasswordByUser,
    deletePassword
}