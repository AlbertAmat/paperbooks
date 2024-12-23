import ICategory from "@/types/category/ICategory";
import ILanguage from "@/types/language/ILanguage";
import {IFormat} from "@/types/format/IFormat";

export default interface IPolicyResponse {
    user: null;
    categories: ICategory[];
    languages: ILanguage[];
    formats: IFormat[];
}