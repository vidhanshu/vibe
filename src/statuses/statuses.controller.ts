import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { StatusesService } from './statuses.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { User } from 'src/common/decorators/user.decorator';
import { FilterStatusesDto } from './dto/filter-statuses.dto';

@Controller('statuses')
export class StatusesController {
  constructor(private statusesService: StatusesService) {}

  @Get()
  getStatuses(
    @Query() filterStatusesDto: FilterStatusesDto,
    @User('sub') userId: string,
  ) {
    return this.statusesService.getStatuses(userId, filterStatusesDto);
  }

  @Post()
  addStatus(
    @Body() createStatusDto: CreateStatusDto,
    @User('sub') userId: string,
  ) {
    return this.statusesService.addStatus(userId, createStatusDto);
  }

  @Delete()
  deleteStatus(@User('sub') userId: string) {
    return this.statusesService.deleteStatus(userId);
  }
}
