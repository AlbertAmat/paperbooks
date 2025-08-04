import {IUser} from "@/types/user/IUser";
import {ref, Ref} from "vue";

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

}