
const { selectAllTopics } = require("../models/topics.model")



exports.getAllTopics = (req, res, next) => {
    selectAllTopics().then(({ rows }) => {
    const topics = rows
    res.status(200).send({ topics })
})
.catch(next)

}