import ABook from "@/model/book/ABook";
import IBookItem from "@/types/book/IBookItem";

export default class BookItem extends ABook {
    public constructor(data: IBookItem) {
        super(data);
    }
}