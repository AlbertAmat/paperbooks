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

    /**
     * Change the current user's password. New password reissues the session cookie.
     * @param currentPassword Current (soon to be old) password, for verification.
     * @param newPassword New password to set.
     */
    public async changePassword(currentPassword: string, newPassword: string) {
        await axiosInstance.post(`${PATH_PREFIX}/user/password`, {
            currentPassword: currentPassword,
            newPassword : newPassword,
        })
    }

    /**
     * Update the current user's profile fields.
     * @param name New display name.
     * @param email New email address.
     * @param language New preferred UI language (2-letter code).
     * @param region New preferred region code.
     */
    public async update(name: string, email: string, language: string, region: string) {
        await axiosInstance.put(`${PATH_PREFIX}/user`, {
            name: name,
            email: email,
            language: language,
            region: region
        })
    }

    /**
     * Acknowledge the security-measures notice shown to public-institution
     * accounts (see SecurityNoticeDialog.vue). Records the acceptance date
     * server-side so the dialog doesn't show again for this user.
     */
    public async acceptSecurityNotice() {
        await axiosInstance.post(`${PATH_PREFIX}/user/security-notice/accept`)
    }

}

/** Singleton instance shared by every part of the app. */
export const userService = new UserService();
