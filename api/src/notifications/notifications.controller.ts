import { Body, Controller, Get, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { User } from 'src/common/decorators/user.decorator';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getNotifications(
    @Query() notificationFilterDto: PaginationDto,
    @User('sub') userId,
  ) {
    return this.notificationsService.getNotifications(
      userId,
      notificationFilterDto ?? {},
    );
  }
}
