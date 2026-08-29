import {PATH_PREFIX} from "@/Constants";
import axiosInstance from "@/plugins/axiosInstance";
import ICategory from "@/types/category/ICategory";

/**
 * Thin HTTP client for the `/api/rest/category` endpoints (see server/src/routes/CategoriesRoute.ts).
 *
 * @example
 * const categories = await categoriesService.getCategories();
 * const created = await categoriesService.addCategory("Fantasy");
 */
class CategoriesService {

    /** Fetch every category belonging to the user. */
    public async getCategories(): Promise<ICategory[]> {
        const {data} = await axiosInstance.get(`${PATH_PREFIX}/category`)
        return data;
    }

    /** Rename an existing category. */
    public async updateCategory(id: number, name: string) {
        await axiosInstance.put(`${PATH_PREFIX}/category/${id}`, {
            name: name,
        })
    }

    /** Create a new category and return the created record. */
    public async addCategory(name: string): Promise<ICategory> {
        const {data} = await axiosInstance.post(`${PATH_PREFIX}/category`, {
            name: name,
        })

        return data;
    }

    /** Delete a category by id. */
    public async deleteCategory(id: number): Promise<void> {
        await axiosInstance.delete(`${PATH_PREFIX}/category/${id}`)
    }
}

export const categoriesService = new CategoriesService();
