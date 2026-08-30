/**
 * A customer tag (label + color), scoped to the user and shared across all
 * their customers.
 *
 * @example
 * const t: ITag = { id: 1, name: "VIP", color: "#ff0000" };
 */
export interface ITag {
    /** Tag id. */
    id: number;
    /** Tag name. */
    name: string;
    /** Tag color (CSS color string). */
    color: string;
}
