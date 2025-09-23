import {BookStockStatusEnum} from "@/types/book/IBookStock";

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

export interface IDashboardStockSatuts {
    status: BookStockStatusEnum; // 0: available, 1: not available, 2: booked, 3: damaged
    count: number;
}

export interface IBooksInTime {
    month: string; // e.g., "2025-08-01T00:00:00.000Z"
    total_books: number;
}

export interface IDashboardBook {
    id: number;
    name: string;
    image_url: string | null;
    isbn: string | null;
}