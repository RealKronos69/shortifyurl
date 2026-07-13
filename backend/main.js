import express, { json } from 'express'
import cors from 'cors'
import db from './schema.js'
import { nanoid } from 'nanoid'
const app = express()

app.use(cors())

app.get('/', (req, res) => {
    res.send('hello')
})
app.use(json())

app.get('/:slug', async (req, res) => {
    const short = await db.findOne({ shorturl: req.params.slug })
    res.redirect(short.url)
})

app.post('/', async (req, res) => {
    const url = req.body.URL
    const exists = await db.findOne({ url: url })
    if (exists) {
        console.log('url already exists')
        res.json({
            shorturl: exists.shorturl,
        })
        return;
    }
    const short = nanoid(8)
    await db.insertOne({ url: url, shorturl: short })
    res.json({
        shorturl: short,
    })
})

app.listen(3000)