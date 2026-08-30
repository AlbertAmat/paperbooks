/**
 * Global controller backing the single `ConfirmationDialog.vue` instance
 * mounted in App.vue. Turns a "confirm this destructive action" prompt into
 * a Promise, so calling code can simply `await` the user's answer instead
 * of wiring up its own dialog state.
 *
 * @example
 * const confirmed = await confirmationDialogController.showDialog(
 *   i18n.global.t(AppLabels.DELETE_BOOK),
 *   i18n.global.t(AppLabels.DELETE_BOOK_DESC),
 *   i18n.global.t(AppLabels.DELETE)
 * );
 * if (confirmed) await book.deleteBook();
 */
import { ref, Ref } from "vue";

export class ConfirmationDialogController {
    /** Whether the dialog is currently visible. */
    private m_visible: Ref<boolean> = ref(false);

    /** Current dialog title. */
    private m_title = "";

    /** Current dialog description/body text. */
    private m_desc = "";

    /** Current confirm button label. */
    private m_action = "";

    /** Resolver for the pending `showDialog()` promise, or null if none is pending. */
    private m_resolver: ((value: boolean) => void) | null = null;

    /** Rejecter for the pending `showDialog()` promise, or null if none is pending. */
    private m_reject: ((value: boolean) => void) | null = null;

    /** @returns Whether the dialog is currently visible. */
    public isVisible(): boolean {
        return this.m_visible.value;
    }

    /** @param value New visibility. */
    public setVisible(value: boolean) {
        this.m_visible.value = value;
    }

    /** @returns The current dialog title. */
    public getTitle() {
        return this.m_title;
    }

    /** @returns The current dialog description/body text. */
    public getDescription() {
        return this.m_desc;
    }

    /** @returns The current confirm button label. */
    public getAction() {
        return this.m_action;
    }

    /**
     * Show the confirmation dialog and return a Promise resolved `true` if
     * the user confirms (`executeAction()`) or rejected `false` if they
     * cancel (`cancelAction()`).
     * @param title Dialog title.
     * @param desc Dialog description/body text.
     * @param action Label for the confirm button.
     * @returns A promise resolving `true` on confirm, rejecting `false` on cancel.
     */
    public showDialog(title: string, desc: string, action: string): Promise<boolean> {
        this.m_title = title;
        this.m_desc = desc;
        this.m_action = action;

        this.m_visible.value = true;

        return new Promise<boolean>((resolve, reject) => {
            this.m_resolver = resolve;
            this.m_reject = reject;
        });
    }

    /** Resolve the pending `showDialog()` promise with `true` and hide the dialog. */
    public executeAction() {
        if (this.m_resolver) {
            this.m_resolver(true); // Aceptado
            this.m_resolver = null;
            this.m_reject = null;
        }
        this.m_visible.value = false;
    }

    /** Reject the pending `showDialog()` promise with `false` and hide the dialog. */
    public cancelAction() {
        if (this.m_reject) {
            this.m_reject(false); // Cancelado
            this.m_resolver = null;
            this.m_reject = null;
        }
        this.m_visible.value = false;
    }
}

/** Singleton instance shared by every part of the app. */
export const confirmationDialogController = new ConfirmationDialogController();
