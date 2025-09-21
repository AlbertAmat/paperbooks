import ILocationBook from "@/types/location/ILocationBook";
import {BookStockStatusEnum} from "@/types/book/IBookStock";

export default class LocationBook {
    private readonly m_id:number;
    private readonly m_bookId: number;
    private readonly m_code: string;
    private readonly m_name: string;
    private readonly m_imageUrl: string | null;
    private readonly m_status: BookStockStatusEnum

    public constructor(data: ILocationBook) {
       this.m_id = data.id;
       this.m_bookId = data.book_id;
       this.m_code = data.code;
       this.m_name = data.name;
       this.m_status = data.status;
       this.m_imageUrl = data.image_url;
    }

    public getStockId(): number {
        return this.m_id;
    }

    public getBookId(): number {
        return this.m_bookId;
    }

    public getStockCode(): string {
        return this.m_code;
    }

    public getBookName(): string {
        return this.m_name;
    }

    public getBookImageUrl(): string | null {
        return this.m_imageUrl;
    }

    public getStockStatus(): BookStockStatusEnum {
        return this.m_status
    }
}