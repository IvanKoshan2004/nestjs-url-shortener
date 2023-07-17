import { AuthUserGuard } from './guards/auth-user.guard';

describe('AuthGuard', () => {
    it('should be defined', () => {
        expect(new AuthUserGuard()).toBeDefined();
    });
});
