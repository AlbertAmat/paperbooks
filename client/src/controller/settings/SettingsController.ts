/**
 * Backs the account settings view. The "fetch" just reads the already-loaded
 * user from `ApplicationService` (populated once at app bootstrap via
 * `GET /app/policy`) rather than making a new network call.
 */
import {BaseController} from "@/controller/BaseController";
import User from "@/model/user/User";
import {applicationService} from "@/service/ApplicationService";
import {i18n} from "@/plugins/i18n/i18n";
import {AppLabels} from "@/plugins/i18n/AppLabels";

export default class SettingsController extends BaseController<User> {

    public constructor() {
        super(i18n.global.t(AppLabels.SETTINGS));
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