const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const fs = require("fs/promises")
require("dotenv").config()
const exercise = require("./data/exercise.json")
const mongoose = require("mongoose")
const router = require("./server/router/index")
const app = express()
const errorMiddleware = require("./server/middlewares/error-middlewares.js")

app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
)
app.use("/api", router)
app.use(errorMiddleware)

app.get("/exercise", (req, res) => {
    res.json(exercise)
})

app.get("/category", (req, res) => {
    let set = new Set()
    for (let el of exercise) {
        set.add(el.category)
    }
    res.json(Array.from(set))
})

app.post("/filter", (req, res) => {
    const filterObject = req.body

    res.json(exercise.filter((item) => filterObject.includes(item.category)))
})

app.post("/current-page", (req, res) => {
    const filterObject = req.body
    let currentPageExercise = filterObject.arrTraining.slice(
        filterObject.start,
        filterObject.end
    )

    res.json(currentPageExercise)
})

app.post("/add-exercise", async (req, res) => {
    try {
        const newExercise = req.body
        const currentData = await fs.readFile("./data/exercise.json", "utf-8")
        const currentExercise = JSON.parse(currentData)
        currentExercise.push(newExercise)
        await fs.writeFile(
            "./data/exercise.json",
            JSON.stringify(currentExercise, null, 2),
            "utf-8"
        )
        res.json({ success: true, message: "Exercise added successfully" })
    } catch (error) {
        console.log(error)
    }
})

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        const port = process.env.PORT || 4000

        app.listen(port, () => {
            console.log(` server is running on port ${port}`)
        })
    } catch (e) {
        console.log(e)
    }
}
start()
