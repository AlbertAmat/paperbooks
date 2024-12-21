import ICategory from "@/types/categories/ICategory";
import ILanguage from "@/types/language/ILanguage";

export default interface IPolicyResponse {
    user: null;
    categories: ICategory[];
    languages: ILanguage[];
}