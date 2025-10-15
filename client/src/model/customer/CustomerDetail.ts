import {Ref, ref, ShallowRef, shallowRef} from "vue";
import ICustomer, {ICustomerDetail} from "@/types/customer/ICustomer";
import {customersService} from "@/service/customers/CustomersService";
import {ICustomerBook} from "@/types/customer/ICustomerBook";
import {CustomerBook} from "@/model/customer/CustomerBook";
import Customer from "@/model/customer/Customer";

export default class CustomerDetail extends Customer {

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

    /**
     *
     * @private
     */
    private m_tags: Ref<number[]> = ref([]);

    public constructor(data: ICustomerDetail) {
        super(data);
        this.m_totalBooks = ref(data.total_books);
        this.m_books = shallowRef([]);
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

    /**
     *
     */
    public getTags(): number[] {
        return this.m_tags.value;
    }
}