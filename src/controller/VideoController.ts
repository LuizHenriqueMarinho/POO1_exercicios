import { VideoBusiness } from './../business/VideoBusiness';
import { Request, Response } from "express"
import { VideoDatabase } from "../database/VideoDatabase"


export class VideoController {
    public getVideos =  async (req: Request, res: Response) => {
        try{
            const q = req.query.q as string | undefined
    
            const videoBusiness = new VideoBusiness()
            const output = videoBusiness.getVideos(q)
    
            res.status(200).send(output)
            
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
    }

    public createVideo = async (req: Request, res: Response) => {
        try{
            const input = { 
                id:req.body.id, 
                title:req.body.title, 
                lengthS:req.body.lengthS
            }

            const videoBusiness = new VideoBusiness()
            const output = videoBusiness.createVideo(input)
    
            res.status(200).send({message: "video criado com sucesso!", output})
    
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
    }

    public editVideo = async (req: Request, res: Response) => {
        try {
            const id = req.body.id
            const input = { 
                title:req.body.title, 
                lengthS:req.body.lengthS
            }

            const videoBusiness = new VideoBusiness()
            const output = videoBusiness.editVideo(id, input)
    
            res.status(200).send(output)
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
    }

    public removeVideo = async (req: Request, res: Response) => {
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
    }
}