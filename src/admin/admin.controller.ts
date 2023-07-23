import { UseGuards, Controller, Get, Param, Delete, Query } from '@nestjs/common';
import { AuthAdminGuard } from '../auth/guards/auth-admin.guard';
import { controllerTryCatchWrapper } from '../lib/controller-try-catch-wrapper';
import { AdminService } from './admin.service';

@UseGuards(AuthAdminGuard)
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}
    @Get('users')
    getUsers(@Query('o') offset: number, @Query('c') count: number) {
        return controllerTryCatchWrapper(() => {
            return this.adminService.getUsers(offset, count);
        });
    }
    @Get('urls')
    getShortUrls(@Query('o') offset: number, @Query('c') count: number) {
        return controllerTryCatchWrapper(() => {
            return this.adminService.getShortUrls(offset, count);
        });
    }
    @Get('users/:userId')
    getUserById(@Param('userId') userId: string) {
        return controllerTryCatchWrapper(() => {
            return this.adminService.getUserById(userId);
        });
    }
    @Delete('users/:userId')
    deleteUserById(@Param('userId') userId: string) {
        return controllerTryCatchWrapper(() => {
            return this.adminService.deleteUserById(userId);
        });
    }
    @Get('urls/:urlId/statistics')
    getShortUrlStatisticsById(@Param('urlId') urlId: string) {
        return controllerTryCatchWrapper(() => {
            return this.adminService.getShortUrlStatisticsById(urlId);
        });
    }
    @Get('urls/:urlId')
    getShortUrlById(@Param('urlId') urlId: string) {
        return controllerTryCatchWrapper(() => {
            return this.adminService.getShortUrlById(urlId);
        });
    }
    @Delete('urls/:userId')
    deleteShortUrlById(@Param('userId') userId: string) {
        return controllerTryCatchWrapper(() => {
            return this.adminService.deleteShortUrlById(userId);
        });
    }
}
