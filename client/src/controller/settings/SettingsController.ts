import {BaseController} from "@/controller/BaseController";
import User from "@/model/user/User";
import {applicationService} from "@/service/ApplicationService";

export default class SettingsController extends BaseController<User> {

    public constructor() {
        super("Settings");
    }

    async fetchData(): Promise<User> {
        return new Promise((resolve, reject) => {
            resolve(applicationService.getUser());
        });
    }

    setData(data: User | null): void {
        // DO NOTHING
    }

    public getUser(): User {
        return applicationService.getUser();
    }

}