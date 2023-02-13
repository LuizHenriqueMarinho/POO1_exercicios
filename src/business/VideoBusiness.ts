import { VideoDatabase } from "../database/VideoDatabase"
import { Video } from "../models/Video"
import { videoDB } from "../types"


export class VideoBusiness {
    public getVideos = async (q:string | undefined) => {
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
        return(videos)
    }

    public createVideo = async (params: any) => {
        const {id, title, lengthS} = params
    
        if (typeof id !== "string") {
            //res.status(400)
            throw new Error("'id' deve ser string")
        }

        if (typeof title !== "string") {
            //res.status(400)
            throw new Error("'title' deve ser string")
        }

        if (typeof lengthS !== "number") {
            //res.status(400)
            throw new Error("'duração' deve ser number")
        }

       const videoDatabase = new VideoDatabase();
       const videoDBExists = await videoDatabase.findVideoById(id) 

       if(videoDBExists){
            //res.status(400)
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
        return(newVideo)
    }

    public editVideo = async (id:string, params:any) => {

        const {title, lengthS} = params

        if (typeof title !== "string") {
            //res.status(400)
            throw new Error("'title' deve ser string")
        }

        if (typeof lengthS !== "number") {
            //res.status(400)
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
        return(videoEdited)
    }
}