import {PATH_PREFIX} from "@/Constants";
import axiosInstance from "@/plugins/axiosInstance";
import ILanguage from "@/types/language/ILanguage";

class LanguagesService {

    public async getLanguages(): Promise<ILanguage[]> {
        const {data} = await axiosInstance.get(`${PATH_PREFIX}/language`)
        return data;
    }

    public async updateLanguage(code:string, name: string) {
        await axiosInstance.put(`${PATH_PREFIX}/language/${code}`, {
            name: name,
        })
    }

    public async addLanguage(code: string, name: string): Promise<void> {
        const {data} = await axiosInstance.post(`${PATH_PREFIX}/language`, {
            code: code,
            name: name
        })

        return data;
    }

    public async deleteLanguage(code: string): Promise<void> {
        await axiosInstance.delete(`${PATH_PREFIX}/language/${code}`)
    }
}

export const languagesService = new LanguagesService();