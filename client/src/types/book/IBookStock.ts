export interface IBookStock {
    id: number;
    code: string;
    status:BookStockStatusEnum;
    location: { id: number; name: string} | null;
}

export enum BookStockStatusEnum {
    AVAILABLE = 0,
    NOT_AVAILABLE = 1,
    BOOKED = 2,
    DAMAGE = 3
}