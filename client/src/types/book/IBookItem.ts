import IBookAuthor from "@/types/book/IBookAuthor";
import {IBookBase} from "@/types/book/IBookBase";

export default interface IBookItem extends IBookBase{
    category_id: number | null;
    language_code: string | null;
    authors: IBookAuthor[];
}