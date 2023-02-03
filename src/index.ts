import cors from "cors"
import express, { Request, Response } from "express"
import { db } from "./database/knex"
import { Video } from "./models/Video"
import { videoDB } from "./types"


const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.get('/videos', async (req: Request, res: Response) => {
    try{
        const videosDB: videoDB[] = await db("videos")

        const videos: Video[] = videosDB.map((videoDB) => 
            new Video(
                videoDB.id,
                videoDB.title,
                videoDB.length_s,
                videoDB.created_at
            )
        )

        res.status(200).send(videos)
    }catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.post("/videos", async (req: Request, res: Response) => {
    try{
        const {id, title, lengthS, createdAt} = req.body

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' deve ser string")
        }

        if (typeof title !== "string") {
            res.status(400)
            throw new Error("'title' deve ser string")
        }

        if (typeof lengthS !== "number") {
            res.status(400)
            throw new Error("'duração' deve ser number")
        }


        const newVideo: Video = new Video(
            id, 
            title, 
            lengthS, 
            new Date().toISOString()
        )
        
        const newVideoDB: videoDB = {
            id: newVideo.getId(),
            title: newVideo.getTitle(),
            length_s: newVideo.getLengthS(),
            created_at: new Date().toISOString()
        }

        await db("videos").insert(newVideoDB)
        res.status(200).send({message: "video criado com sucesso!", newVideo})

    }catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.put("/videos/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const {title, lengthS} = req.body

        if (typeof title !== "string") {
            res.status(400)
            throw new Error("'title' deve ser string")
        }

        if (typeof lengthS !== "number") {
            res.status(400)
            throw new Error("'duração' deve ser number")
        }

        const [videoDB]: videoDB[] = await db("videos").where("id", "=", `${id}`)

        const videoEdited = new Video(
            videoDB.id,
            title,
            lengthS,
            new Date().toISOString()
        )

        await db("videos")
        .update({title: videoEdited.getTitle(), length_s: videoEdited.getLengthS(), created_at: new Date().toISOString()})
        .where({ id })

        res.status(200).send(videoEdited)
    }catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.delete("/videos/:id", async (req: Request, res: Response) => {
    try{
        const id = req.params.id

        const result = await db("videos").where({id: id})

    if(result){
        await db("videos").del().where({id: id})
        res.status(200).send("video deletado com sucesso")
    } else{
        res.status(400)
        throw new Error("video não encontrado")
    }
    }catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

