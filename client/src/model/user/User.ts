// Type definition for a User object coming from the backend
import { IUser } from "@/types/user/IUser";

// Vue's reactive reference utilities
import { ref, Ref } from "vue";

// Service for performing API calls related to the user
import { userService } from "@/service/user/UserService";

// Controller for showing feedback messages (snackbars) to the user
import { appSnackbarController } from "@/components/appSnackbar/AppSnackbarController";

/**
 * Represents a user of the application and provides methods to
 * access and modify the user's profile data reactively.
 */
export default class User {

    /**
     * Unique immutable user code assigned by the system.
     * @private
     */
    private readonly m_code: string;

    /**
     * User's name stored as a reactive value.
     * @private
     */
    private m_name: Ref<string>;

    /**
     * User's email address stored as a reactive value.
     * @private
     */
    private m_email: Ref<string>;

    /**
     * User's preferred language stored as a reactive value.
     * @private
     */
    private m_language: Ref<string>;

    /**
     * User's region stored as a reactive value.
     * @private
     */
    private m_region: Ref<string>;

    /**
     * Base64 or URL of the user's profile image, if any.
     * Stored as a reactive value to allow UI updates.
     * @private
     */
    private m_image: Ref<string | null>;

    /**
     * Initializes a User instance with data from the backend.
     * @param data - IUser object containing initial user information.
     */
    public constructor(data: IUser) {
        this.m_code = data.code;
        this.m_email = ref(data.email);
        this.m_name = ref(data.name);
        this.m_language = ref(data.language);
        this.m_region = ref(data.region);
        this.m_image = ref(data.image);
    }

    /**
     * Returns the immutable user code.
     */
    public getCode(): string {
        return this.m_code;
    }

    /**
     * Returns the current email address.
     */
    public getEmail(): string {
        return this.m_email.value;
    }

    /**
     * Returns the current display name of the user.
     */
    public getName(): string {
        return this.m_name.value;
    }

    /**
     * Returns the user's preferred language.
     */
    public getLanguage(): string {
        return this.m_language.value;
    }

    /**
     * Returns the user's region.
     */
    public getRegion(): string {
        return this.m_region.value;
    }

    /**
     * Returns the current profile image as a Base64 string or URL.
     */
    public getImage(): string | null {
        return this.m_image.value;
    }

    /**
     * Checks if the user has an associated profile image.
     */
    public hasImage(): boolean {
        return this.m_image.value != null;
    }

    /**
     * Deletes the current user's account from the system.
     * Handles any errors that occur during deletion.
     */
    public async delete() {
        try {
            await userService.delete();
        } catch (e) {
            console.error("Error while deleting user: ", e);
        }
    }

    /**
     * Updates the user's profile information and shows a success snackbar.
     * On success, it updates the reactive properties locally.
     * @param name - New name of the user
     * @param email - New email address
     * @param language - New preferred language
     * @param region - New region
     */
    public async update(name: string, email: string, language: string, region: string) {
        try {
            await userService.update(name, email, language, region);
            appSnackbarController.show({ message: "Profile information updated successfully" });
            this.m_email.value = email;
            this.m_name.value = name;
            this.m_language.value = language;
            this.m_region.value = region;
        } catch (e) {
            console.error("Error while updating user profile: ", e);
        }
    }

    /**
     * Removes the current profile image, updates local state,
     * and shows a success snackbar.
     */
    public async removeImage() {
        try {
            await userService.removeImage();
            this.m_image.value = null;
            appSnackbarController.show({ message: "Profile image has been removed successfully" });
        } catch (e) {
            console.error("Error while removing image: ", e);
        }
    }

    /**
     * Uploads a new profile image, updates the local reactive image
     * with a Base64 preview, and shows a success snackbar.
     * @param image - The image file to upload.
     */
    public async uploadImage(image: File) {
        try {
            await userService.uploadImage(image);
            const base64 = await this.__toBase64(image);
            this.m_image.value = base64;
            appSnackbarController.show({ message: "Profile image has been uploaded successfully" });
        } catch (e) {
            console.error("Error while uploading image: ", e);
        }
    }

    /**
     * Converts a File object to a Base64-encoded string.
     * @param file - File to convert.
     * @returns Promise that resolves to a Base64 string or null if an error occurs.
     * @private
     */
    private __toBase64(file: File): Promise<string | null> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file); // Convert file to Base64 data URL
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(null);
        });
    }
}