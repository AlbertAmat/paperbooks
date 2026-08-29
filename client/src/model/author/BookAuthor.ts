/**
 * View model wrapping an author as attached to a book (see IBookAuthor).
 * `m_authorName` is reactive so renaming an author (via `update()`) is
 * reflected everywhere the same instance is rendered.
 *
 * @example
 * const author = new BookAuthor({ id: 4, name: "J.R.R. Tolkien" });
 * await author.update("J. R. R. Tolkien");
 */
import IBookAuthor from "@/types/book/IBookAuthor";
import {authorsService} from "@/service/author/AuthorsService";
import {Ref, ref} from "vue";
import {appSnackbarController} from "@/components/appSnackbar/AppSnackbarController";
import {i18n} from "@/plugins/i18n/i18n";
import {AppLabels} from "@/plugins/i18n/AppLabels";

export default class BookAuthor {

    private readonly m_authorId: number;

    private m_authorName: Ref<string>;

    public constructor(data: IBookAuthor) {
        this.m_authorId = data.id;
        this.m_authorName = ref(data.name);
    }

    public getAuthorId(): number {
        return this.m_authorId;
    }

    public getAuthorName(): string {
        return this.m_authorName.value;
    }

    /** Persist a new name via `AuthorsService`, then update local state and show a confirmation snackbar. */
    public async update(name: string) {
        await authorsService.updateAuthor(this.m_authorId, name);
        appSnackbarController.show({message: i18n.global.t(AppLabels.SNACKBAR_AUTHOR_UPDATED)})
        this.m_authorName.value = name;
    }
}