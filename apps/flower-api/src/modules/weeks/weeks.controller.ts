/**
 * Weeks Controller - HTTP Layer
 * Follows NestJS best practices: Thin controllers, delegates to services
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { WeeksService } from './weeks.service';
import { CreateWeekDto } from './dtos/create-week.dto';
import { UpdateWeekDto } from './dtos/update-week.dto';
import { WeekResponseDto } from './dtos/week-response.dto';
import { WeekSummaryDto } from './dtos/week-summary.dto';

@ApiTags('weeks')
@Controller('flower-weeks')
export class WeeksController {
  constructor(private readonly weeksService: WeeksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new week' })
  @ApiCreatedResponse({
    type: WeekResponseDto,
    description: 'Week created successfully',
  })
  @ApiConflictResponse({ description: 'Week already exists' })
  create(@Body() createWeekDto: CreateWeekDto): Promise<WeekResponseDto> {
    return this.weeksService.create(createWeekDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all weeks' })
  @ApiOkResponse({
    type: [WeekResponseDto],
    description: 'List of all weeks',
  })
  findAll(): Promise<WeekResponseDto[]> {
    return this.weeksService.findAll();
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get summary statistics' })
  @ApiOkResponse({
    type: WeekSummaryDto,
    description: 'Summary statistics',
  })
  getSummary(): Promise<WeekSummaryDto> {
    return this.weeksService.getSummary();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a week by ID' })
  @ApiOkResponse({
    type: WeekResponseDto,
    description: 'Week found',
  })
  @ApiNotFoundResponse({ description: 'Week not found' })
  findOne(@Param('id') id: string): Promise<WeekResponseDto> {
    return this.weeksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a week' })
  @ApiOkResponse({
    type: WeekResponseDto,
    description: 'Week updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Week not found' })
  update(
    @Param('id') id: string,
    @Body() updateWeekDto: UpdateWeekDto,
  ): Promise<WeekResponseDto> {
    return this.weeksService.update(id, updateWeekDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a week' })
  @ApiNotFoundResponse({ description: 'Week not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.weeksService.remove(id);
  }
}

