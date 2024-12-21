import ICategory from "@/types/categories/ICategory";

export default class Category {
    /**
     *
     * @private
     */
    private readonly m_categoryId: number;

    /**
     *
     * @private
     */
    private readonly m_categoryName: string;

    public constructor(data: ICategory) {
        this.m_categoryId = data.id;
        this.m_categoryName = data.name;
    }

    /**
     *
     */
    public getCategoryId(): number {
        return this.m_categoryId;
    }

    /**
     *
     */
    public getCategoryName(): string {
        return this.m_categoryName;
    }
}