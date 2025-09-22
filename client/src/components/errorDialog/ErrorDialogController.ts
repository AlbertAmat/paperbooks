import { ref, Ref } from "vue";
import {AxiosError} from "axios";

export class ErrorDialogController {

    /**
     *
     * @private
     */
    private m_visible: Ref<boolean> = ref(false);

    /**
     *
     * @private
     */
    private m_error: AxiosError | null = null;

    public isVisible(): boolean {
        return this.m_visible.value;
    }

    public setVisible(value: boolean) {
        this.m_visible.value = value;
    }

    /**
     *
     */
    public getError(): AxiosError | null {
        return this.m_error;
    }

    /**
     *
     * @param error
     */
    public showDialog(error: AxiosError) {
        this.m_error = error;
        this.m_visible.value = true;
    }
}

export const errorDialogController = new ErrorDialogController();
