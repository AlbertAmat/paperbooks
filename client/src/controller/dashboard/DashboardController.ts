// Import the base controller to inherit common controller functionality
import { BaseController } from "@/controller/BaseController";

// Types for the dashboard data
import IDashboard, {
    IBooksInTime,
    IDashboardBook,
    IDashboardStockSatuts
} from "@/types/dashboard/IDashboard";

// Service to fetch dashboard-related data
import { dashboardService } from "@/service/dashboard/DashboardService";
import {i18n} from "@/plugins/i18n/i18n";
import {AppLabels} from "@/plugins/i18n/AppLabels";

/**
 * Controller class responsible for fetching and holding
 * the dashboard data used throughout the UI.
 */
export default class DashboardController extends BaseController<IDashboard> {

    /**
     * Recently added books displayed on the dashboard.
     * @private
     */
    private m_lastBooks: IDashboardBook[] = [];

    /**
     * Total number of books in the system.
     * @private
     */
    private m_totalBooks: number = 0;

    /**
     * Number of books added in the current month.
     * @private
     */
    private m_totalThisMonth: number = 0;

    /**
     * Number of books added in the previous month.
     * @private
     */
    private m_totalLastMonth: number = 0;

    /**
     * Total number of categories in the system.
     * @private
     */
    private m_totalCategories: number = 0;

    /**
     * Total number of customers registered.
     * @private
     */
    private m_totalCustomers: number = 0;

    /**
     * Total number of books currently booked/reserved.
     * @private
     */
    private m_totalBookedBooks: number = 0;

    /**
     * Total number of physical locations (e.g., branches or stores).
     * @private
     */
    private m_totalLocations: number = 0;

    private m_totalAuthors: number = 0;

    /**
     * Time-series data of books added over time.
     * @private
     */
    private m_booksInTime: IBooksInTime[] = [];

    /**
     * Summary of stock statuses for all books.
     * @private
     */
    private m_stockStatus: IDashboardStockSatuts[] = [];

    /**
     * Constructor initializes the controller with the identifier "Dashboard".
     */
    public constructor() {
        super(i18n.global.t(AppLabels.DASHBOARD));
    }

    /**
     * Fetches the dashboard data from the backend service.
     * @returns A promise resolving to the dashboard data.
     */
    async fetchData(): Promise<IDashboard> {
        return await dashboardService.getData();
    }

    /**
     * Populates the controller state with the fetched dashboard data.
     * @param data - The dashboard data object retrieved from the service.
     */
    setData(data: IDashboard) {
        this.m_lastBooks = data.lastBooks;
        this.m_totalBooks = data.totalBooks;
        this.m_totalThisMonth = data.totalThisMonth;
        this.m_totalLastMonth = data.totalLastMonth;
        this.m_totalCategories = data.totalCategories;
        this.m_totalCustomers = data.totalCustomers;
        this.m_totalLocations = data.totalLocations;
        this.m_totalBookedBooks = data.totalBookedBooks;
        this.m_booksInTime = data.booksInTime;
        this.m_stockStatus = data.stockStatus;
        this.m_totalAuthors = data.totalAuthors;
    }

    /**
     * Returns the list of most recently added books.
     */
    public getLastBooks() {
        return this.m_lastBooks;
    }

    /**
     * Returns the total number of books.
     */
    public getTotalBooks() {
        return this.m_totalBooks;
    }

    /**
     * Returns the number of books added this month.
     */
    public getTotalThisMonth() {
        return this.m_totalThisMonth;
    }

    /**
     * Returns the number of books added last month.
     */
    public getTotalLastMonth() {
        return this.m_totalLastMonth;
    }

    public getTotalAuthors(): number {
        return this.m_totalAuthors;
    }

    /**
     * Returns the total number of categories.
     */
    public getTotalCategories() {
        return this.m_totalCategories;
    }

    /**
     * Returns the total number of physical locations.
     */
    public getTotalLocations() {
        return this.m_totalLocations;
    }

    /**
     * Returns the total number of registered customers.
     */
    public getTotalCustomers() {
        return this.m_totalCustomers;
    }

    /**
     * Returns the total number of booked/reserved books.
     */
    public getTotalBookedBooks() {
        return this.m_totalBookedBooks;
    }

    /**
     * Returns time-series data for books added over time.
     */
    public getBooksInTime() {
        return this.m_booksInTime;
    }

    /**
     * Returns the stock status data for all books.
     */
    public getStockStatus() {
        return this.m_stockStatus;
    }

}