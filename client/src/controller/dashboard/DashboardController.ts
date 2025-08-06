import {BaseController} from "@/controller/BaseController";
import {ShallowRef, shallowRef} from "vue";
import ICategory from "@/types/category/ICategory";
import Category from "@/model/category/Category";
import {categoriesService} from "@/service/categories/CategoriesService";
import IDashboard, {IBooksInTime, IDashboardBook, IDashboardStockSatuts} from "@/types/dashboard/IDashboard";
import {dashboardService} from "@/service/dashboard/DashboardService";
import {BookStockStatusEnum} from "@/types/book/IBookStock";

export default class DashboardController extends BaseController<IDashboard> {

    private m_lastBooks: IDashboardBook[] = [];
    private m_totalBooks: number = 0;
    private m_totalThisMonth: number = 0;
    private m_totalLastMonth: number = 0;
    private m_totalCategories: number = 0;
    private m_totalCustomers: number = 0;
    private m_booksInTime: IBooksInTime[] = [];
    private m_stockStatus: IDashboardStockSatuts[] = [];

    public constructor() {
        super("Dashboard");
    }

    async fetchData(): Promise<IDashboard> {
        return await dashboardService.getData()
    }

    setData(data: IDashboard) {
        this.m_lastBooks = data.lastBooks;
        this.m_totalBooks = data.totalBooks;
        this.m_totalThisMonth = data.totalThisMonth;
        this.m_totalLastMonth = data.totalLastMonth;
        this.m_totalCategories = data.totalCategories;
        this.m_totalCustomers = data.totalCustomers;
        this.m_booksInTime = data.booksInTime;
        this.m_stockStatus = data.stockStatus;
    }

    public getLastBooks() {
        return this.m_lastBooks;
    }

    public getTotalBooks() {
        return this.m_totalBooks;
    }

    public getTotalThisMonth() {
        return this.m_totalThisMonth;
    }

    public getTotalLastMonth() {
        return this.m_totalLastMonth;
    }

    public getTotalCategories() {
        return this.m_totalCategories;
    }

    public getTotalCustomers() {
        return this.m_totalCustomers;
    }

    public getBooksInTime() {
        return this.m_booksInTime;
    }

    public getStockStatus() {
        return this.m_stockStatus;
    }

}