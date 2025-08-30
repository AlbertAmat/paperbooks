import Location from "@/model/location/Location";
import ILocationExt from "@/types/location/ILocationExt";

export default class LocationExt extends Location{
    private readonly m_totalBooks: number;

    public constructor(location: ILocationExt) {
        super(location);
        this.m_totalBooks = location.total_books;
    }

    public getTotalBooks(): number {
        return this.m_totalBooks;
    }
}