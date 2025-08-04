import ICategory from "@/types/category/ICategory";
import ILanguage from "@/types/language/ILanguage";
import {IFormat} from "@/types/format/IFormat";
import ILocation from "@/types/location/ILocation";
import {IUser} from "@/types/user/IUser";

export default interface IPolicyResponse {
    user: IUser;
    categories: ICategory[];
    languages: ILanguage[];
    formats: IFormat[];
    locations: ILocation[];
}