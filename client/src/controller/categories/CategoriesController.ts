import {BaseController} from "@/controller/BaseController";
import {ShallowRef, shallowRef} from "vue";
import ICategory from "@/types/category/ICategory";
import Category from "@/model/category/Category";
import {categoriesService} from "@/service/categories/CategoriesService";

export default class CategoriesController extends BaseController<ICategory[]> {

    /**
     *
     * @private
     */
    private m_categories: ShallowRef<Category[]> = shallowRef([]);

    public constructor() {
        super("Categories");
    }

    async fetchData(): Promise<ICategory[]> {
        return await categoriesService.getCategories()
    }

    setData(data: ICategory[]) {
        this.m_categories.value = data.map(category => new Category(category));
    }

    /**
     *
     */
    public getCategories(): Category[] {
        return this.m_categories.value;
    }

    /**
     *
     */
    public getCategory(id: number): Category | undefined {
        return this.m_categories.value.find(category => category.getCategoryId() === id);
    }

    /**
     *
     * @param name
     * @param description
     */
    public async addCategory(name: string) {
        try {
            const category = await categoriesService.addCategory(name);
            this.m_categories.value = [...this.m_categories.value, new Category(category)];
        } catch (e) {
            console.error(e);
        }
    }

    /**
     *
     * @param id
     */
    public async deleteCategory(id: number) {
        const index = this.m_categories.value.findIndex(category => category.getCategoryId() === id);
        if(index != -1 ) {
            try {
                await categoriesService.deleteCategory(id);
                this.m_categories.value.splice(index, 1);
                this.m_categories.value = [...this.m_categories.value];
            } catch (e) {
                console.error(e);
            }
        }
    }
}