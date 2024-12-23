import IBookAuthor from "@/types/book/IBookAuthor";

export default class BookAuthor {

    /**
     *
     * @private
     */
    private readonly m_authorId: number;

    /**
     *
     * @private
     */
    private readonly m_authorName: string;

    public constructor(data: IBookAuthor) {
        this.m_authorId = data.id;
        this.m_authorName = data.name;
    }

    /**
     *
     */
    public getAuthorId(): number {
        return this.m_authorId;
    }

    /**
     *
     */
    public getAuthorName(): string {
        return this.m_authorName;
    }
}