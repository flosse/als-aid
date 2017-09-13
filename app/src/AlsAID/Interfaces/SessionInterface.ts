export interface SessionInterface {
    id: number,
    meta_id: number,
    user_id: number,
    created_at?: any,
    updated_at?: any,
    logs: [any],
    meta: {
        address?: any,
        age?: any,
        id?: any,
        location?: any,
        name?: any,
        sex?: any,
    }
}
