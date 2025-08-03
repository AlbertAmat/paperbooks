import ILocation from "@/types/location/ILocation";
import {locationsService} from "@/service/locations/LocationsService";
import {ref, Ref} from "vue";

export default class Location {
    private readonly m_id: number;
    private m_name: Ref<string>;
    private m_description: Ref<string | null>;

    public constructor(location: ILocation) {
        this.m_id = location.id;
        this.m_name = ref(location.name);
        this.m_description = ref(location.description);
    }

    public getId(): number {
        return this.m_id;
    }

    public getName(): string {
        return this.m_name.value;
    }

    public getDescription(): string | null {
        return this.m_description.value;
    }

    public async update(name: string, description: string | null) {
        await locationsService.updateLocation(this.m_id, name, description)
        this.m_name.value = name;
        this.m_description.value = description;
    }
}