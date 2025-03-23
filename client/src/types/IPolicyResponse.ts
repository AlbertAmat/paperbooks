import ICategory from "@/types/category/ICategory";
import ILanguage from "@/types/language/ILanguage";
import {IFormat} from "@/types/format/IFormat";
import ILocation from "@/types/location/ILocation";

export default interface IPolicyResponse {
    user: null;
    categories: ICategory[];
    languages: ILanguage[];
    formats: IFormat[];
    locations: ILocation[];

    // DATABASE
    /**
     * The max size allowen for the databse (in MB)
     */
    maxSize: number;
    /**
     * THe current databse size (in MB)
     */
    size: number;
}