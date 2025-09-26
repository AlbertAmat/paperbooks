import { ref, Ref, ShallowRef, shallowRef } from "vue";
import jsPDF from "jspdf";
import {appSnackbarController, SnackbarType} from "@/components/appSnackbar/AppSnackbarController";
import {i18n} from "@/plugins/i18n/i18n";
import {AppLabels} from "@/plugins/i18n/AppLabels";

export interface PrintLabelItem {
    name: string;
    label: HTMLCanvasElement;
}

/**
 * Controller class for managing a print dialog in a Vue application.
 * Handles visibility, compact mode, label management, and PDF printing.
 */
export class PrintDialogController {

    /**
     * Tracks whether the print dialog is visible or not.
     * @private
     */
    private m_visible: Ref<boolean> = ref(false);

    /**
     * Stores the canvas elements for each label keyed by name.
     * Uses ShallowRef to avoid deep reactivity on canvas elements (improves performance).
     * @private
     */
    private m_labels: ShallowRef<Record<string, PrintLabelItem>> = shallowRef({});

    /**
     * Checks if the dialog is currently visible.
     * @returns {boolean} true if visible, false otherwise
     */
    public isVisible() {
        return this.m_visible.value;
    }

    /**
     * Checks if the dialog is currently visible.
     * @returns {boolean} true if visible, false otherwise
     */
    public setVisible(value: boolean) {
        this.m_visible.value = value;
    }

    /**
     * Returns all the label canvases currently stored.
     * @returns {Record<string, HTMLCanvasElement>} object containing label canvases
     */
    public getLabels(): Record<string, PrintLabelItem> {
        return this.m_labels.value;
    }

    /**
     * Returns the total number of labels stored.
     * @returns {number} count of label canvases
     */
    public getTotalLabels(): number {
        return Object.keys(this.m_labels.value).length;
    }

    /**
     * Adds a new label canvas to the collection.
     * @param name - unique name for the label
     * @param label - canvas element representing the label
     */
    public addLabel(name: string, code: string, label: HTMLCanvasElement) {
        if(Object.keys(this.m_labels.value).includes(code)) {
            console.warn("label already exist");
            appSnackbarController.show({
                message: i18n.global.t(AppLabels.SNACKBAR_PRINT_LABEL_ALREADY_ADDED),
                type: SnackbarType.ERROR
            })
            return;
        }

        this.m_labels.value[code] = {name: name, label: label};
        // Trigger reactivity update by replacing the object with a shallow copy
        this.m_labels.value = { ...this.m_labels.value };

        appSnackbarController.show({
            message:  i18n.global.t(AppLabels.SNACKBAR_PRINT_LABEL_ADDED)
        })
    }

    /**
     * Generates a PDF containing all the stored label canvases and prompts download.
     * Each label is scaled to fit a single A4 page while maintaining aspect ratio.
     */
    public print() {
        if (this.getTotalLabels() === 0) {
            console.log("No labels to print");
            return;
        }

        const labels: PrintLabelItem[] = Object.values(this.m_labels.value);

        const pdf = new jsPDF({
            orientation: "landscape",
            unit: "pt",
            format: "a4"
        });

        labels.forEach((item: PrintLabelItem, index) => {
            const imgData = item.label.toDataURL("image/png");
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            // Scale the canvas to fit the page while keeping the aspect ratio
            const imgProps = pdf.getImageProperties(imgData);
            const ratio = Math.min(pageWidth / imgProps.width, pageHeight / imgProps.height);
            const imgWidth = imgProps.width * ratio;
            const imgHeight = imgProps.height * ratio;

            // Center the image on the page
            const x = (pageWidth - imgWidth) / 2;
            const y = (pageHeight - imgHeight) / 2;

            pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);

            // Add a new page for each label except the last
            if (index < labels.length - 1) {
                pdf.addPage();
            }
        });

        // Prompt the user to download the PDF
        pdf.save("labels.pdf");
        this.cancel();
    }

    /**
     * Resets the dialog state: hides it, exits mini mode, and clears all labels.
     */
    public cancel() {
        this.m_visible.value = false;
        this.m_labels.value = {};
    }
}

export const printDialogController = new PrintDialogController();