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
    lastBooks: IDashboardBook[];
    totalBooks: number;
    totalThisMonth: number;
    totalLastMonth: number;
    totalCategories: number;
    totalCustomers: number;
    totalLocations: number;
    totalBookedBooks: number;
    totalAuthors: number;
    booksInTime: IBooksInTime[];
    stockStatus: IDashboardStockSatuts[];
}

/** Count of book stocks grouped by lifecycle status, for the stock-status chart. */
export interface IDashboardStockSatuts {
    status: BookStockStatusEnum; // 0: available, 1: not available, 2: booked, 3: damaged
    count: number;
}

/** Number of books created in a given month, for the "books over time" chart. */
export interface IBooksInTime {
    month: string; // e.g., "2025-08-01T00:00:00.000Z"
    total_books: number;
}

/** Minimal book fields shown in the dashboard's "recently added" list. */
export interface IDashboardBook {
    id: number;
    name: string;
    image_url: string | null;
    isbn: string | null;
}
