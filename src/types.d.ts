export interface User {
    exp: int;
    iat: int;
    user_id: int;
    email: string;
    first_name: string;
    last_name: string;
    permissions: any; // analyze, data entry
    roles: any; //admin
}

export interface Country {
    id: string = uuid(),
}

export interface Center {
    id: string = uuid(),
    wbmt_id: int,
    wbmt_gctn: string,
    name: string,
    name_2: string,
    country_iso: string,
    country_name: string,
    type: string,
    get_type_display: string,
    region: int,
    city: string,
    active: boolean,
    representatives: string[],
}

export interface GuardedRoute {
    requiresPermission?: string,
    requiresRole?: string,
    redirectPath?: '/login' | '/signup' | '/landing',
    children?: any,
}
export {User, Center, Country, GuardedRoute}