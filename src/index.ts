import cors from "cors"
import express, { Request, Response } from "express"
import { Video } from "./models/Video"
import { videoDB } from "./types"
import { VideoDatabase } from './database/VideoDatabase'

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
        const q = req.query.q as string | undefined

        const videoDatabase = new VideoDatabase()
        const videosDB = await videoDatabase.findVideos(q)

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

       const videoDatabase = new VideoDatabase();
       const videoDBExists = await videoDatabase.findVideoById(id) 

       if(videoDBExists){
            res.status(400)
            throw new Error("'id' já existe")
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

        await videoDatabase.insertVideo(newVideoDB)

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

        const videoDatabase = new VideoDatabase()
        const videoDB = await videoDatabase.findVideoById(id) 


        const videoEdited = new Video(
            videoDB.id,
            title,
            lengthS,
            new Date().toISOString()
        )

        await videoDatabase.updateVideo(videoEdited.getTitle(), videoEdited.getLengthS(), videoDB.id)

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

        const videoDatabase = new VideoDatabase()
        const result = await videoDatabase.findVideoById(id) 

    if(result){
        await videoDatabase.deleteVideo(id)
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

