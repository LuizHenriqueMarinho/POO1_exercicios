export class Video {

    constructor(
        private id: string,
        private title: string,
        private lengthS: number,
        private createdAt: string
    ){}

    public getCreatedAt(): string {
        return this.createdAt;
    }
    public setCreatedAt(value: string) {
        this.createdAt = value;
    }
    public getLengthS(): number {
        return this.lengthS;
    }
    public setLengthS(value: number) {
        this.lengthS = value;
    }
    public getTitle(): string {
        return this.title;
    }
    public setTitle(value: string) {
        this.title = value;
    }
    public getId(): string {
        return this.id;
    }
    public setId(value: string) {
        this.id = value;
    }
}


