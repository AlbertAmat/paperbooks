import {BookStockStatusEnum, IBookStock} from "@/types/book/IBookStock";
import JsBarcode from "jsbarcode";
import {bookService} from "@/service/book/BookService";
import {ref, Ref} from "vue";
import {appSnackbarController} from "@/components/appSnackbar/AppSnackbarController";

export default class BookStock {

    public static BookStockStatus = [
        {
            value: BookStockStatusEnum.BOOKED,
            text: "Booked",
            color: "#3F51B5"
        },
        {
            value: BookStockStatusEnum.AVAILABLE,
            text: "Available",
            color: "#4CAF50"
        },
        {
            value: BookStockStatusEnum.NOT_AVAILABLE,
            text: "Not available",
            color: "#607D8B"
        },
        {
            value: BookStockStatusEnum.DAMAGE,
            text: "Damage",
            color: "#FF5722"
        },
    ]

    /**
     * The book id as reference
     * @private
     */
    private readonly m_bookId: number;

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

    public constructor(bookId: number, stock: IBookStock) {
        this.m_bookId       = bookId;
        this.m_id       = stock.id;
        this.m_code     = stock.code;
        this.m_status   = ref(stock.status);

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
     * @param productCode
     * @private
     */
    public printBarcode() {
        // Create a temporary canvas
        const canvas = document.createElement("canvas");

        // Generate the barcode on the canvas
        JsBarcode(canvas, this.m_code, { format: "CODE128" });

        // Convert canvas to Base64 image
        const barcodeImage = canvas.toDataURL("image/png");

        // Open a new print window
        const printWindow = window.open("", "_blank", "toolbar=no,menubar=no,scrollbars=no,resizable=no,status=no");

        if (printWindow) {
            printWindow.document.write(`
            <html>
                <head>
                    <title>Print Barcode</title>
                </head>
                <body>
                    <img src="${barcodeImage}" alt="Barcode">
                    <br>
                    <button onclick="window.print();">Print</button>
                </body>
            </html>
        `);
            printWindow.document.close();
        }
    }

    public async update(status: BookStockStatusEnum, locationId: number, customerId: number | null) {
        try {
            const data = await bookService.updateBookStock(this.m_bookId, this.m_id, status, locationId, customerId);
            this.m_status.value = data.status;
            this.m_locationId.value = data.location_id;
            this.m_locationName = data.location_name;
            this.m_customerId.value = data.customer_id;
            this.m_customerName = data.customer_name;

            appSnackbarController.show({message: `Book stock updated successfully`})
        } catch (e) {
            console.error("Error while updating book stock", e)
        }
    }

}