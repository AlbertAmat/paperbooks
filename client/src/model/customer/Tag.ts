/** View model for a customer tag (label + color), used to color-code customers. */
import {ref, Ref} from "vue";
import {ITag} from "@/types/customer/ITag";

export class Tag {

    /** Tag id, immutable once loaded. */
    private readonly m_id: number;

    /** Tag name. */
    private m_name: Ref<string>;

    /** Tag color (CSS color string, e.g. "#ff0000"). */
    private m_color: Ref<string>;

    /** @param data Raw tag data from the server. */
    public constructor(data: ITag) {
        this.m_id = data.id;
        this.m_name = ref(data.name);
        this.m_color = ref(data.color);
    }

    /** @returns The tag id. */
    public getId(): number {
        return this.m_id;
    }

    /** @returns The tag name. */
    public getName(): string {
        return this.m_name.value;
    }

    /** @param value New tag name. */
    public setName(value: string) {
        return this.m_name.value;
    }

    /** @returns The tag color. */
    public getColor(): string {
        return this.m_color.value;
    }

    /** @param value New tag color. */
    public setColor(value: string) {
        this.m_color.value = value;
    }
}
