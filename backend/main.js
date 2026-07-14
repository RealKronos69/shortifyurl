import express, { json } from 'express'
import cors from 'cors'
import db from './schema.js'
import { nanoid } from 'nanoid'
import path from 'path'
const app = express()
app.use(json())
app.use(cors())

// const protectedroute = async (req,res,next)=>{
//     if (req.body && req.body.isprotected === true) {
//         return res.status(403).json({redirect:'http://localhost:3000/protected'})
//     }
//     next()
// }




app.get('/', (req, res) => {
    res.send('hello')
})

app.get('/protected', (req, res) => {
    res.sendFile(path.resolve('backend','password.html'))
})

app.post('/protected',async (req,res)=>{
    const pass = req.body.password
    const org = await db.findOne({shorturl:req.body.shorturl})
    if (pass===org.password) {
        return res.json({
            success: true,
            url: org.url
        });
    }
    res.status(401).json(
        {
            success:false,
            message:'password not matched'
        }
    )
})


app.get('/api/:slug', async (req, res) => {
    
    const short = await db.findOne({ shorturl: req.params.slug })
    if (!short) {
        return res.status(404).send('Short URL not found')
    }
    if (short.isprotected===true) {
        return res.redirect(`/protected?shorturl=${req.params.slug}`)
    }
    res.redirect(short.url)
})

app.post('/', async (req, res) => {
    const {URL,isprotected,password} = req.body
    const exists = await db.findOne({ url: URL })
    if (exists) {
        console.log('url already exists')
        res.status(201).json({
            shorturl: exists.shorturl,
        })
        return;
    }
    const short = nanoid(8)
    await db.insertOne({ url: URL, shorturl: short,isprotected: isprotected, password:password})
    res.status(201).json({
        shorturl: short,
    })
})

app.listen(3000)