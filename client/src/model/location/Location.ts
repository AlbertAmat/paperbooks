import ILocation from "@/types/location/ILocation";

export default class Location {
    private readonly m_id: number;
    private readonly m_name: string;
    private readonly m_description: string | null;

    public constructor(location: ILocation) {
        this.m_id = location.id;
        this.m_name = location.name;
        this.m_description = location.description;
    }

    public getId(): number {
        return this.m_id;
    }

    public getName(): string {
        return this.m_name
    }

    public getDescription(): string | null {
        return this.m_description;
    }
}