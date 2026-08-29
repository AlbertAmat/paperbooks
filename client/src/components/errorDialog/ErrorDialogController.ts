/**
 * Global controller backing the single `ErrorDialog.vue` instance mounted
 * in App.vue. `axiosInstance`'s response interceptor calls
 * `showDialog(error)` for any unhandled server/network error, so the app
 * doesn't need per-call error UI - see `plugins/axiosInstance.ts`.
 */
import { ref, Ref } from "vue";
import {AxiosError} from "axios";

export class ErrorDialogController {

    private m_visible: Ref<boolean> = ref(false);
    private m_error: AxiosError | null = null;

    public isVisible(): boolean {
        return this.m_visible.value;
    }

    public setVisible(value: boolean) {
        this.m_visible.value = value;
    }

    public getError(): AxiosError | null {
        return this.m_error;
    }

    /** Store the error and make the dialog visible. */
    public showDialog(error: AxiosError) {
        this.m_error = error;
        this.m_visible.value = true;
    }
}

export const errorDialogController = new ErrorDialogController();
