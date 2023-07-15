declare namespace Express {
    interface Request {
        user: {
            _id: string;
            username: string;
            session_id: string;
            iat: number;
            max_age: number;
        };
    }
}
