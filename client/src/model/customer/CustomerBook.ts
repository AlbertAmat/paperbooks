import {bookRoute} from "@/router/routes/BookRoute";
import {ICustomerBook} from "@/types/customer/ICustomerBook";

export class CustomerBook {

    /**
     *
     * @private
     */
    protected readonly m_id: number;

    /**
     *
     * @private
     */
    protected readonly m_name: string;

    /**
     *
     * @private
     */
    protected readonly m_imageUrl: string | null;

    /**
     *
     * @private
     */
    protected readonly m_isbn: string | null;

    /**
     *
     * @private
     */
    protected readonly m_stockCode: string;

    public constructor(data: ICustomerBook) {
        this.m_id = data.id;
        this.m_name = data.name;
        this.m_imageUrl = data.image_url;
        this.m_isbn = data.isbn;
        this.m_stockCode = data.code;
    }

    /**
     *
     */
    public getId(): number {
        return this.m_id;
    }

    /**
     *
     */
    public getName(): string {
        return this.m_name;
    }

    /**
     *
     */
    public getStockCode(): string {
        return this.m_stockCode;
    }

    /**
     *
     */
    public getImageUrl(): string | null {
        return this.m_imageUrl;
    }

    /**
     *
     */
    public hasIsbn(): boolean {
        return this.m_isbn != null;
    }

    /**
     *
     */
    public getIsbn(): string | null {
        return this.m_isbn;
    }

    /**
     *
     */
    public getUrl(): string {
        return bookRoute.getPath(this.m_id)
    }
}