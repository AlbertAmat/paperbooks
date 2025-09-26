import {BookStockStatusEnum, IBookStock} from "@/types/book/IBookStock";
import JsBarcode from "jsbarcode";
import {bookService} from "@/service/book/BookService";
import {ref, Ref} from "vue";
import {appSnackbarController} from "@/components/appSnackbar/AppSnackbarController";
import {i18n} from "@/plugins/i18n/i18n";
import {AppLabels} from "@/plugins/i18n/AppLabels";
import jsPDF from "jspdf";
import ABook from "@/model/book/ABook";

export default class BookStock {

    public static BookStockStatus = [
        {
            value: BookStockStatusEnum.BOOKED,
            text: i18n.global.t(AppLabels.BOOKED),
            color: "#3F51B5"
        },
        {
            value: BookStockStatusEnum.AVAILABLE,
            text: i18n.global.t(AppLabels.AVAILABLE),
            color: "#4CAF50"
        },
        {
            value: BookStockStatusEnum.NOT_AVAILABLE,
            text: i18n.global.t(AppLabels.NOT_AVAILABLE),
            color: "#607D8B"
        },
        {
            value: BookStockStatusEnum.DAMAGE,
            text: i18n.global.t(AppLabels.DAMAGE),
            color: "#FF5722"
        },
    ]

    /**
     * The book id as reference
     * @private
     */
    private readonly m_book: ABook;

    /**
     * The book stock id
     * @private
     */
    private readonly m_id: number;

    /**
     * Unike hash code (where the first number is the book id)
     * @private
     */
    private readonly m_code: string;

    /**
     *
     * @private
     */
    private m_status: Ref<BookStockStatusEnum>;

    /**
     *
     * @private
     */
    private m_locationId: Ref<number | null>;

    /**
     *
     * @private
     */
    private m_locationName: string | null;

    /**
     * The customer id that has booked the book
     * @private
     */
    private m_customerId: Ref<number | null>;

    /**
     * The customer name that has booked the book
     * @private
     */
    private m_customerName: string | null;

    public constructor(book: ABook, stock: IBookStock) {
        this.m_book = book;
        this.m_id = stock.id;
        this.m_code = stock.code;
        this.m_status = ref(stock.status);

        this.m_locationId = ref(stock.location_id);
        this.m_locationName = stock.location_name;

        this.m_customerId = ref(stock.customer_id);
        this.m_customerName = stock.customer_name;
    }

    /**
     *
     */
    public getId(): number {
        return this.m_id;
    }

    /**
     *
     */
    public getCode(): string {
        return this.m_code
    }

    /**
     *
     */
    public getStatus(): BookStockStatusEnum {
        return this.m_status.value;
    }

    public getLocationId(): number | null {
        return this.m_locationId.value;
    }

    public getLocationName(): string | null {
        return this.m_locationName;
    }

    public getCustomerId(): number | null {
        return this.m_customerId.value;
    }

    public getCustomerName(): string | null {
        return this.m_customerName;
    }

    /**
     *
     */
    /**
     * Generate a barcode image with a custom description below.
     */
    public generateBarcodeImage(): HTMLCanvasElement {
        // Create a barcode-only canvas
        const barcodeCanvas = document.createElement('canvas');
        JsBarcode(barcodeCanvas, this.m_code, {
            format: "CODE128",
            displayValue: false,
            width: 4,
            height: 150,
            margin: 20
        });

        // Prepare final canvas with extra space for text
        const paddingBottom = 30; // space for description
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = barcodeCanvas.width;
        finalCanvas.height = barcodeCanvas.height + paddingBottom;

        const ctx = finalCanvas.getContext('2d');
        if (!ctx) return finalCanvas;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

        // Draw barcode on top of white background
        ctx.drawImage(barcodeCanvas, 0, 0);

        // Add black text below barcode
        ctx.font = "30px Arial";
        ctx.fillStyle = "#000000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const yPos = barcodeCanvas.height + paddingBottom / 2;
        ctx.fillText(`${this.m_book.getName()} : ${this.m_code}`, finalCanvas.width / 2, yPos);

        // return finalCanvas.toDataURL("image/png");
        return finalCanvas;
    }

    /**
     *
     * @param status
     * @param locationId
     * @param customerId
     */
    public async update(status: BookStockStatusEnum, locationId: number, customerId: number | null) {
        try {
            const data = await bookService.updateBookStock(this.m_book.getId(), this.m_id, status, locationId, customerId);
            this.m_status.value = data.status;
            this.m_locationId.value = data.location_id;
            this.m_locationName = data.location_name;
            this.m_customerId.value = data.customer_id;
            this.m_customerName = data.customer_name;

            appSnackbarController.show({message: i18n.global.t(AppLabels.SNACKBAR_BOOK_STOCK_UPDATED)})
        } catch (e) {
            console.error("Error while updating book stock", e)
        }
    }

}