import {Ref, ref, ShallowRef, shallowRef} from "vue";
import ICustomer from "@/types/customer/ICustomer";
import {customersService} from "@/service/customers/CustomersService";
import {ICustomerBook} from "@/types/customer/ICustomerBook";
import {CustomerBook} from "@/model/customer/CustomerBook";

export default class Customer {
    /**
     *
     * @private
     */
    private readonly m_customerId: number;

    /**
     *
     * @private
     */
    private readonly m_customerName: Ref<string>;

    /**
     *
     * @private
     */
    private readonly m_totalBooks: Ref<number>;

    /**
     *
     * @private
     */
    private m_books: ShallowRef<CustomerBook[]>;

    public constructor(data: ICustomer) {
        this.m_customerId = data.id;
        this.m_customerName = ref(data.name);
        this.m_totalBooks = ref(data.total_books);
        this.m_books = shallowRef([]);
    }

    /**
     *
     */
    public getCustomerId(): number {
        return this.m_customerId;
    }

    /**
     *
     */
    public getCustomerName(): string {
        return this.m_customerName.value;
    }

    /**
     *
     */
    public getTotalBooks(): number {
        return this.m_totalBooks.value;
    }

    /**
     *
     */
    public getBooks(): CustomerBook[] {
        return this.m_books.value;
    }

    /**
     *
     * @param books
     */
    public setBooks(books: ICustomerBook[]) {
        this.m_books.value = books.map((book) => new CustomerBook(book));
    }

    /**
     *
     */
    public async fetchBooks() {
        const books = await customersService.getCustomerBooks(this.m_customerId);
        this.m_books.value = books.map((book) => new CustomerBook(book));
        this.m_totalBooks.value =  this.m_books.value.length;
    }

    /**
     *
     * @param name
     */
    public async update(name:string) {
        await customersService.updateCustomer(this.m_customerId, name);
        this.m_customerName.value = name;
    }

    /**
     *
     * @param bookStockCode
     */
    public async removeBook(bookStockCode: string) {
        await customersService.removeCustomerBook(this.m_customerId, bookStockCode);

        const index = this.m_books.value.findIndex((books) => books.getStockCode() === bookStockCode);
        if(index != -1) {
            this.m_books.value.splice(index, 1);
            this.m_books.value = [...this.m_books.value];
            this.m_totalBooks.value = this.m_totalBooks.value -1;
        }
    }
}