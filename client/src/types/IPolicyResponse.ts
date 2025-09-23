import ICategory from "@/types/category/ICategory";
import ILanguage from "@/types/language/ILanguage";
import {IFormat} from "@/types/format/IFormat";
import ILocation from "@/types/location/ILocation";
import {IUser} from "@/types/user/IUser";
import ICustomer from "@/types/customer/ICustomer";

export default interface IPolicyResponse {
    user: IUser;
    customers: ICustomer[];
    categories: ICategory[];
    languages: ILanguage[];
    formats: IFormat[];
    locations: ILocation[];
    labels: Record<string, string>;
}