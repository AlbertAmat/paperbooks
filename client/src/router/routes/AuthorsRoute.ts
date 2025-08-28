import {ARoute} from "@/router/ARoute";

export class AuthorsRoute extends ARoute {

    public static PATH = "/authors";

    private m_name: string = "Authors";

    public getRoute() {
        return  {
            name: this.m_name,
            path: AuthorsRoute.PATH,
            component: () => import('@/views/authors/AuthorsView.vue'),
        }
    }

    public getPath() {
        return AuthorsRoute.PATH;
    }
}

export const authorsRoute = new AuthorsRoute();