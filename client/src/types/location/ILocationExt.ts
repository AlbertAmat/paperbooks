import ILocation from "@/types/location/ILocation";

/**
 * `ILocation` extended with a `total_books` count, used on the locations
 * list view.
 */
export default interface ILocationExt extends ILocation{
    total_books: number;
}
