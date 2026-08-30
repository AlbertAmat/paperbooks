import {BookStockStatusEnum} from "@/types/book/IBookStock";

/**
 * Aggregate response shape for `GET /dashboard`, powering the dashboard
 * view's KPI tiles and charts.
 *
 * @example
 * const d: IDashboard = {
 *   lastBooks: [], totalBooks: 42, totalThisMonth: 3, totalLastMonth: 5,
 *   totalCategories: 6, totalCustomers: 10, totalLocations: 2, totalBookedBooks: 5,
 *   totalAuthors: 15, booksInTime: [], stockStatus: []
 * };
 */
export default interface IDashboard {
    /** Most recently added books. */
    lastBooks: IDashboardBook[];
    /** Total number of books. */
    totalBooks: number;
    /** Number of books added this calendar month. */
    totalThisMonth: number;
    /** Number of books added last calendar month. */
    totalLastMonth: number;
    /** Total number of categories. */
    totalCategories: number;
    /** Total number of customers. */
    totalCustomers: number;
    /** Total number of locations. */
    totalLocations: number;
    /** Total number of books currently booked/loaned out. */
    totalBookedBooks: number;
    /** Total number of authors. */
    totalAuthors: number;
    /** Number of books added per month, for the "books over time" chart. */
    booksInTime: IBooksInTime[];
    /** Count of book stocks grouped by lifecycle status. */
    stockStatus: IDashboardStockSatuts[];
}

/** Count of book stocks grouped by lifecycle status, for the stock-status chart. */
export interface IDashboardStockSatuts {
    /** Stock lifecycle status (0: available, 1: not available, 2: booked, 3: damaged). */
    status: BookStockStatusEnum;
    /** Number of stocks with this status. */
    count: number;
}

/** Number of books created in a given month, for the "books over time" chart. */
export interface IBooksInTime {
    /** Month start, ISO string (e.g., "2025-08-01T00:00:00.000Z"). */
    month: string;
    /** Number of books created in that month. */
    total_books: number;
}

/** Minimal book fields shown in the dashboard's "recently added" list. */
export interface IDashboardBook {
    /** Book id. */
    id: number;
    /** Book title. */
    name: string;
    /** Cover image URL/data-URI, or null if none. */
    image_url: string | null;
    /** ISBN code, or null if none. */
    isbn: string | null;
}
