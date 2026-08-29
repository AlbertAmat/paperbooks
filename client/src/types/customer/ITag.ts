/**
 * A customer tag (label + color), scoped to the user and shared across all
 * their customers.
 *
 * @example
 * const t: ITag = { id: 1, name: "VIP", color: "#ff0000" };
 */
export interface ITag {
    id: number;
    name: string;
    color: string;
}
