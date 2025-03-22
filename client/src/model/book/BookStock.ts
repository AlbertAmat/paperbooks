import {BookStockStatusEnum, IBookStock} from "@/types/book/IBookStock";

export default class BookStock {

    public static BookStockStatus = [
        {
            value: BookStockStatusEnum.BOOKED,
            text: "Booked",
            color: "#3F51B5"
        },
        {
            value: BookStockStatusEnum.AVAILABLE,
            text: "Available",
            color: "#4CAF50"
        },
        {
            value: BookStockStatusEnum.NOT_AVAILABLE,
            text: "Not available",
            color: "#607D8B"
        },
        {
            value: BookStockStatusEnum.DAMAGE,
            text: "Damage",
            color: "#FF5722"
        },
    ]

    /**
     * The book stock id
     * @private
     */
    private readonly m_id: number;

    /**
     * Unike hash code (where the first number is the book id)
     * @private
     */
    private readonly m_code: string;

    /**
     *
     * @private
     */
    private m_status: BookStockStatusEnum;

    /**
     *
     * @private
     */
    private m_locationId: number | null;

    /**
     *
     * @private
     */
    private m_locationName: string | null;

    public constructor(stock: IBookStock) {
        this.m_id       = stock.id;
        this.m_code     = stock.code;
        this.m_status   = stock.status;

        this.m_locationId = null;
        this.m_locationName = null;

        if(stock.location) {
            this.m_locationId = stock.location.id;
            this.m_locationName = stock.location.name;
        }
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
    public getCode(): string {
        return this.m_code
    }

    /**
     *
     */
    public getStatus(): BookStockStatusEnum {
        return this.m_status;
    }

    public getLocationId(): number | null {
        return this.m_locationId;
    }

    public getLocationName(): string | null {
        return this.m_locationName;
    }



}