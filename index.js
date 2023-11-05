const express = require("express")
const cors = require("cors")
const exercise = require("./data/exercise.json")

const app = express()

app.use(cors())

app.get("/exercise", (req, res) => {
    res.json(exercise)
})

const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log(` server is running on port ${port}`)
})
