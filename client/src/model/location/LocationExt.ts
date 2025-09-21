import Location from "@/model/location/Location";
import ILocationExt from "@/types/location/ILocationExt";
import {locationsService} from "@/service/locations/LocationsService";
import LocationBook from "@/model/location/LocationBook";
import {shallowRef, ShallowRef} from "vue";
import ILocationBook from "@/types/location/ILocationBook";

export default class LocationExt extends Location{

    /**
     *
     * @private
     */
    private readonly m_totalBooks: number;

    /**
     *
     * @private
     */
    private m_books: ShallowRef<LocationBook[]> = shallowRef([]);

    /**
     *
     * @param location
     */
    public constructor(location: ILocationExt) {
        super(location);
        this.m_totalBooks = location.total_books;
    }

    public getTotalBooks(): number {
        return this.m_totalBooks;
    }

    /**
     *
     */
    public getBooks(): LocationBook[] {
        return this.m_books.value;
    }

    public setBooks(books: ILocationBook[]) {
        this.m_books.value = books.map((book) => new LocationBook(book));
    }

    /**
     *
     */
    public async fetchBooks() {
        const books = await locationsService.getLocationBooks(this.m_id);
        this.m_books.value = books.map((book) => new LocationBook(book));
    }
}