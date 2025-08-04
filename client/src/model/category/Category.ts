import ICategory from "@/types/category/ICategory";
import {categoriesService} from "@/service/categories/CategoriesService";
import {Ref, ref} from "vue";

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
    private readonly m_categoryName: Ref<string>;

    public constructor(data: ICategory) {
        this.m_categoryId = data.id;
        this.m_categoryName = ref(data.name);
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
        return this.m_categoryName.value;
    }

    public async update(name: string) {
        await categoriesService.updateCategory(this.m_categoryId, name)
        this.m_categoryName.value = name;
    }
}