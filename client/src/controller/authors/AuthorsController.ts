
import {BaseController} from "@/controller/BaseController";
import {ShallowRef, shallowRef} from "vue";
import IBookAuthor from "@/types/book/IBookAuthor";
import BookAuthor from "@/model/author/BookAuthor";
import {authorsService} from "@/service/author/AuthorsService";
import {appSnackbarController} from "@/components/appSnackbar/AppSnackbarController";

export default class AuthorsController extends BaseController<IBookAuthor[]> {

    /**
     *
     * @private
     */
    private m_authors: ShallowRef<BookAuthor[]> = shallowRef([]);

    public constructor() {
        super("Authors");
    }

    /**
     *
     */
    async fetchData(): Promise<IBookAuthor[]> {
        return await authorsService.getAuthors()
    }

    /**
     *
     * @param data
     */
    setData(data: IBookAuthor[]) {
        this.m_authors.value = data.map(author => new BookAuthor(author));
    }

    /**
     *
     */
    public getAuthors(): BookAuthor[] {
        return this.m_authors.value;
    }

    /**
     *
     */
    public getAuthor(id: number): BookAuthor | undefined {
        return this.m_authors.value.find(author => author.getAuthorId() === id);
    }

    /**
     *
     * @param name
     */
    public async addAuthor(name: string) {
        try {
            const customer = await authorsService.addAuthor(name);
            this.m_authors.value = [...this.m_authors.value, new BookAuthor(customer)];
            appSnackbarController.show({message: "New author added: " + name})
        } catch (e) {
            console.error(e);
        }
    }

    /**
     *
     * @param customerId
     */
    public async deleteAuthor(id: number) {
        const index = this.m_authors.value.findIndex(author => author.getAuthorId() === id);
        if(index != -1 ) {
            try {
                await authorsService.deleteAuthor(id);
                this.m_authors.value.splice(index, 1);
                this.m_authors.value = [...this.m_authors.value];
                appSnackbarController.show({message: "Author has been deleted successfully"})
            } catch (e) {
                console.error(e);
            }
        }
    }
}