import {BookStockStatusEnum} from "@/types/book/IBookStock";

/**
 * A book stock currently stored at a location, as returned by
 * `GET /location/:id/books`.
 *
 * @example
 * const b: ILocationBook = {
 *   id: 5, book_id: 12, code: "a1b2c3d4e5", name: "The Hobbit",
 *   image_url: null, status: BookStockStatusEnum.AVAILABLE
 * };
 */
export default interface ILocationBook {
    id:number;
    book_id: number;
    code: string;
    name: string;
    image_url: string | null;
    status: BookStockStatusEnum
}
