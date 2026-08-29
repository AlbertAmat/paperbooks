/**
 * A physical storage location (shelf, room, warehouse, ...), as returned
 * by `GET /location`.
 *
 * @example
 * const l: ILocation = { id: 2, name: "Main shelf", description: "Front room" };
 */
export default interface ILocation {
    id: number;
    name: string;
    description: string | null;
}
