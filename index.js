import cors from "cors"
import express from 'express'
import axios from 'axios'
import { createClient } from 'redis';

const DEFAULT_EXPIRATION = 3600;

const client = createClient();
await client.connect()

const app = express()
app.use(cors())

app.get("/photos", async (req, res) => {
    const albumId = req.query.albumId

    const value = await client.get(`photos?albumId=${albumId}`)
    
    if (value) {
        const value = await client.get(`photos?albumId=${albumId}`)
        console.log("cache hit");
        return res.json(JSON.parse(value))
    } else {
        console.log("cache miss");
        const { data } = await axios.get(
            "https://jsonplaceholder.typicode.com/photos",
            { params: { albumId } }
        )
        client.setEx(`photos?albumId=${albumId}`, DEFAULT_EXPIRATION, JSON.stringify(data))
        res.json(data)
    }
})

app.listen(3000)