const ApiError = require("../exceprions/api-error.js")

module.exports = function (err, req, res, next) {
    if (err instanceof ApiError) {
        console.log(err.message)
        return res
            .status(err.status)
            .json({ message: err.message, errors: err.errors })
    }
    return res.status(500).json({ message: "Some kind of Error" })
}
