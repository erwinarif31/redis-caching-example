import cors from "cors"
import express from 'express'
import axios from 'axios'
const DEFAULT_EXPIRATION = 3600;

import { createClient } from 'redis';

const client = createClient();
await client.connect()

const app = express()
app.use(cors())

app.get("/photos", async (req, res) => {
    const albumId = req.query.albumId

    const dataId = albumId ? albumId : "all"
    // mengambil value dari cache
    const value = await client.get(`photos-${dataId}`)
    
    if (value) {
        console.log(albumId + " cache hit");
        return res.json(JSON.parse(value))
    } else {
        console.log(albumId + " cache miss");
        const { data } = await axios.get(
            "https://jsonplaceholder.typicode.com/photos",
            { params: { albumId } }
        )

        // menyimpan value ke cache
        client.set(`photos-${dataId}`, JSON.stringify(data), "EX", DEFAULT_EXPIRATION)
        res.json(data)
    }
})

app.listen(3000)