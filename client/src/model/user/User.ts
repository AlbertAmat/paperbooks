import {IUser} from "@/types/user/IUser";
import {ref, Ref} from "vue";
import {userService} from "@/service/user/UserService";

export default class User {
    private readonly m_code: string;
    private m_name: Ref<string>;
    private m_email: Ref<string>;
    private m_language: Ref<string>;
    private m_region: Ref<string>;
    private m_image: Ref<string | null>;

    public constructor(data: IUser) {
        this.m_code = data.code;
        this.m_email = ref(data.email);
        this.m_name = ref(data.name);
        this.m_language = ref(data.language);
        this.m_region = ref(data.region);
        this.m_image = ref(data.image);
    }

    public getCode(): string {
        return this.m_code;
    }

    public getEmail(): string {
        return this.m_email.value;
    }

    public getName(): string {
        return this.m_name.value;
    }

    public getLanguage(): string {
        return this.m_language.value;
    }

    public getRegion(): string {
        return this.m_region.value;
    }

    public getImage(): string | null {
        return this.m_image.value;
    }

    public hasImage(): boolean {
        return this.m_image.value != null;
    }


    public async delete() {
        try {
            await userService.delete();
        } catch (e) {
            console.error("error while deleteing user. ", e)
        }
    }

    public async update(name: string, email: string, language: string, region: string) {
        try {
            await userService.update(
                name,
                email,
                language,
                region
            );

            this.m_email.value = email;
            this.m_name.value = name;
            this.m_language.value = language;
            this.m_region.value = region;
        } catch (e) {
            console.error("error while removing image. ", e)
        }
    }

    public async removeImage() {
        try {
            await userService.removeImage();
            this.m_image.value = null;
        } catch (e) {
            console.error("error while removing image. ", e)
        }
    }

    public async uploadImage(image: File) {
        try {
            await userService.uploadImage(image);
            const base64 = await this.__toBase64(image);
            this.m_image.value = base64;
        } catch (e) {
            console.error("error while uploading image. ", e)
        }
    }

    public async changePassword(currentPassword: string, newPassword: string) {
        try {
            await userService.uploadImage(image);
            const base64 = await this.__toBase64(image);
            this.m_image.value = base64;
        } catch (e) {
            console.error("error while uploading image. ", e)
        }
    }

    private __toBase64(file: File): Promise<string | null> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file); // Converts to base64 data URL
            reader.onload = () => resolve(reader.result as string); // reader.result is the base64 string
            reader.onerror = () => reject(null);
        });
    }

}