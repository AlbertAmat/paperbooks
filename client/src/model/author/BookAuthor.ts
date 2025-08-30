import IBookAuthor from "@/types/book/IBookAuthor";
import {authorsService} from "@/service/author/AuthorsService";
import {Ref, ref} from "vue";
import {appSnackbarController} from "@/components/appSnackbar/AppSnackbarController";

export default class BookAuthor {

    /**
     *
     * @private
     */
    private readonly m_authorId: number;

    /**
     *
     * @private
     */
    private m_authorName: Ref<string>;

    public constructor(data: IBookAuthor) {
        this.m_authorId = data.id;
        this.m_authorName = ref(data.name);
    }

    /**
     *
     */
    public getAuthorId(): number {
        return this.m_authorId;
    }

    /**
     *
     */
    public getAuthorName(): string {
        return this.m_authorName.value;
    }

    public async update(name: string) {
        await authorsService.updateAuthor(this.m_authorId, name);
        appSnackbarController.show({message: "Author updated successfully"})
        this.m_authorName.value = name;
    }
}