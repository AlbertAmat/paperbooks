import {PATH_PREFIX} from "@/Constants";
import axiosInstance from "@/plugins/axiosInstance";

/**
 * Thin HTTP client for the `/api/rest/user` endpoints (see server/src/routes/UserRoute.ts):
 * self-service account management for the logged-in user.
 *
 * @example
 * await userService.update("Jane Doe", "jane@example.com", "en", "US");
 * await userService.changePassword("OldS3cret!", "NewS3cret!456");
 */
class UserService {

    /**
     * Upload/replace the current user's profile picture.
     * @param file PNG or JPEG image, max 2MB (enforced server-side).
     */
    public async uploadImage(file: File) {
        const formData = new FormData();
        formData.append("image", file); // "image" must match upload.single("image")

        await axiosInstance.post(`${PATH_PREFIX}/user/image`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                // Add auth header if your `requireAuth` middleware uses tokens
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
    }

    /** Remove the current user's profile picture. */
    public async removeImage() {
        await axiosInstance.delete(`${PATH_PREFIX}/user/image`)
    }

    /** Permanently delete the current user's account. */
    public async delete() {
        await axiosInstance.delete(`${PATH_PREFIX}/user`)
    }

    /** Change the current user's password. New password reissues the session cookie. */
    public async changePassword(currentPassword: string, newPassword: string) {
        await axiosInstance.post(`${PATH_PREFIX}/user/password`, {
            currentPassword: currentPassword,
            newPassword : newPassword,
        })
    }

    /** Update the current user's profile fields. */
    public async update(name: string, email: string, language: string, region: string) {
        await axiosInstance.put(`${PATH_PREFIX}/user`, {
            name: name,
            email: email,
            language: language,
            region: region
        })
    }

}

export const userService = new UserService();
