import cors from "cors"
import express from 'express'
import axios from 'axios'

const app = express()
app.use(cors())

app.get("/photos", async (req, res) => {
    const albumId = req.query.albumId

    const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/photos",
        { params: { albumId } }
    )
    res.json(data)
})

app.listen(3000)