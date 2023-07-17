export type JwtSessionPayload = {
    session_id: string;
    username: string;
    _id: string;
    iat: number;
    max_age: number;
    role: string;
};
