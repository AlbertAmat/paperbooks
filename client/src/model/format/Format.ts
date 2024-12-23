import {IFormat} from "@/types/format/IFormat";

export default class Format {

    /**
     *
     */
    public readonly m_formatId: number;

    /**
     *
     */
    public readonly m_formatName: string;

    public constructor(data: IFormat) {
        this.m_formatId = data.id;
        this.m_formatName = data.name;
    }

    /**
     *
     */
    public getFormatId(): number {
        return this.m_formatId;
    }

    /**
     *
     */
    public getFormatName(): string {
        return this.m_formatName;
    }
}