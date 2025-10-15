import {ref, Ref} from "vue";
import {ITag} from "@/types/customer/ITag";

export class Tag {

    /**
     *
     * @private
     */
    private readonly m_id: number;

    /**
     *
     * @private
     */
    private m_name: Ref<string>;

    /**
     *
     * @private
     */
    private m_color: Ref<string>;

    public constructor(data: ITag) {
        this.m_id = data.id;
        this.m_name = ref(data.name);
        this.m_color = ref(data.color);
    }

    /**
     * Get tag id
     */
    public getId(): number {
        return this.m_id;
    }

    /**
     * Get tag name
     */
    public getName(): string {
        return this.m_name.value;
    }

    /**
     * Set tag name
     */
    public setName(value: string) {
        return this.m_name.value;
    }

    /**
     * Get tag color
     */
    public getColor(): string {
        return this.m_color.value;
    }

    /**
     *
     * @param value
     */
    public setColor(value: string) {
        this.m_color.value = value;
    }
}