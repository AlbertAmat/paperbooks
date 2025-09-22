import {PATH_PREFIX} from "@/Constants";
import axiosInstance from "@/plugins/axiosInstance";
import ICategory from "@/types/category/ICategory";

class CategoriesService {

    public async getCategories(): Promise<ICategory[]> {
        const {data} = await axiosInstance.get(`${PATH_PREFIX}/category`)
        return data;
    }

    public async updateCategory(id: number, name: string) {
        await axiosInstance.put(`${PATH_PREFIX}/category/${id}`, {
            name: name,
        })
    }

    public async addCategory(name: string): Promise<ICategory> {
        const {data} = await axiosInstance.post(`${PATH_PREFIX}/category`, {
            name: name,
        })

        return data;
    }

    public async deleteCategory(id: number): Promise<void> {
        await axiosInstance.delete(`${PATH_PREFIX}/category/${id}`)
    }
}

export const categoriesService = new CategoriesService();