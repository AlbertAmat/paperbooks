import { ref, Ref } from "vue";

export class ConfirmationDialogController {
    private m_visible: Ref<boolean> = ref(false);
    private m_title = "";
    private m_desc = "";
    private m_action = "";

    private m_resolver: ((value: boolean) => void) | null = null;
    private m_reject: ((value: boolean) => void) | null = null;

    public isVisible(): boolean {
        return this.m_visible.value;
    }

    public setVisible(value: boolean) {
        this.m_visible.value = value;
    }

    public getTitle() {
        return this.m_title;
    }

    public getDescription() {
        return this.m_desc;
    }

    public getAction() {
        return this.m_action;
    }

    /**
     * Muestra el diálogo y devuelve una promesa que se resuelve al aceptar o rechazar.
     * @param title
     * @param desc
     * @param action
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

    public executeAction() {
        if (this.m_resolver) {
            this.m_resolver(true); // Aceptado
            this.m_resolver = null;
            this.m_reject = null;
        }
        this.m_visible.value = false;
    }

    public cancelAction() {
        if (this.m_reject) {
            this.m_reject(false); // Cancelado
            this.m_resolver = null;
            this.m_reject = null;
        }
        this.m_visible.value = false;
    }
}

export const confirmationDialogController = new ConfirmationDialogController();
