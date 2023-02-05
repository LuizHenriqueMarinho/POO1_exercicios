import { videoDB } from './../types';
import { BaseDatabase } from "./BaseDatabase";

export class VideoDatabase extends BaseDatabase {
    public static TABLE_VIDEOS = "videos";

    public async findVideos(q: string | undefined) {
        let videosDB

        if(q) {
            const result: videoDB[] = await BaseDatabase.connection(VideoDatabase.TABLE_VIDEOS)
            .where("title", "LIKE", `%${q}%`)

            videosDB = result
        } else {
            const result: videoDB[] = await BaseDatabase.connection(VideoDatabase.TABLE_VIDEOS)

            videosDB = result
        }

        return videosDB
    }

    public async findVideoById(id: string) {
        const [videoDB]: videoDB[] | undefined = await BaseDatabase.connection(VideoDatabase.TABLE_VIDEOS).where({id})
        return videoDB
    }

    public async insertVideo(newVideo: videoDB) {
        await BaseDatabase.connection(VideoDatabase.TABLE_VIDEOS).insert(newVideo)
    }

    public async updateVideo(newTitle: string, newLengthS: number, id: string) {
        await BaseDatabase.connection(VideoDatabase.TABLE_VIDEOS).update({title: newTitle, length_s: newLengthS}).where({id})
    }

    public async deleteVideo(id: string){
        await BaseDatabase.connection(VideoDatabase.TABLE_VIDEOS).del().where({id: id})
    }
}