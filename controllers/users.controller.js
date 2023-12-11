const { selectUsers, selectUserByUsername } = require("../models/users.model")

exports.getUsers = (req, res, next) => {

    selectUsers().then(({rows}) => {
        res.status(200).send(rows)
    })
    .catch((err) => {
        next(err)
    })
}

exports.getUserByUsername = (req, res, next) => {
const { username } = req.params
    selectUserByUsername(username).then(({rows}) => {
        const user = rows
        res.status(200).send(user)
    })
    .catch((err) => {
        next(err)
    })
}
