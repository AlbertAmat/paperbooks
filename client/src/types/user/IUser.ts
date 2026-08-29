/**
 * The current user's profile, as returned inside `IPolicyResponse.user`
 * (`GET /app/policy`) and updated via `PUT /user`.
 *
 * @example
 * const u: IUser = {
 *   code: "jdoe", name: "Jane Doe", email: "jane@example.com",
 *   language: "en", region: "US", image: null, isPublicInstitution: false
 * };
 */
export interface IUser {
    code: string;
    name: string;
    email: string;
    language: string;
    region: string;
    image: string | null;
    isPublicInstitution: boolean;
}
