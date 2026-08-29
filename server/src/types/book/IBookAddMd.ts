import {IBookStockBase} from "./IBookStockBase";
import {IBookBase} from "./IBookBase";

/**
 * Response shape for `GET /book/:bookCode/add/md` - the book plus the single
 * stock that matched the scanned/typed code, used by the "add book to
 * customer/location" flow.
 *
 * @example
 * const md: IBookAddMd = {
 *   id: 12, name: "The Hobbit", image_url: null, isbn: "9780261102217",
 *   stocks: [{ id: 5, code: "a1b2c3d4e5", status: 0 }]
 * };
 */
export interface IBookAddMd extends IBookBase {
    stocks: IBookStockBase[];
}
