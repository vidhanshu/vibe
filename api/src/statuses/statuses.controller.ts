import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { CreateStatusDto } from './dto/create-status.dto';
import { FilterStatusesDto } from './dto/filter-statuses.dto';
import { StatusesService } from './statuses.service';

@Controller('statuses')
export class StatusesController {
  constructor(private statusesService: StatusesService) {}

  @Post(':id/add-view')
  addStatusView(@Param('id') id: string, @User('sub') userId: string) {
    return this.statusesService.addStatusView(id, userId);
  }

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
