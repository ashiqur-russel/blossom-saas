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
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { WeeksService } from './weeks.service';
import { CreateWeekDto } from './dtos/create-week.dto';
import { UpdateWeekDto } from './dtos/update-week.dto';
import { WeekResponseDto } from './dtos/week-response.dto';
import { WeekSummaryDto } from './dtos/week-summary.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserDocument } from '../auth/schemas/user.schema';

@ApiTags('weeks')
@Controller('flower-weeks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
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
  create(
    @Body() createWeekDto: CreateWeekDto,
    @CurrentUser() user: UserDocument,
  ): Promise<WeekResponseDto> {
    return this.weeksService.create(createWeekDto, user._id.toString());
  }

  @Get()
  @ApiOperation({ summary: 'Get all weeks for the current user' })
  @ApiOkResponse({
    type: [WeekResponseDto],
    description: 'List of all weeks for the current user',
  })
  findAll(@CurrentUser() user: UserDocument): Promise<WeekResponseDto[]> {
    return this.weeksService.findAll(user._id.toString());
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get summary statistics for the current user' })
  @ApiOkResponse({
    type: WeekSummaryDto,
    description: 'Summary statistics for the current user',
  })
  getSummary(@CurrentUser() user: UserDocument): Promise<WeekSummaryDto> {
    return this.weeksService.getSummary(user._id.toString());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a week by ID' })
  @ApiOkResponse({
    type: WeekResponseDto,
    description: 'Week found',
  })
  @ApiNotFoundResponse({ description: 'Week not found' })
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: UserDocument,
  ): Promise<WeekResponseDto> {
    return this.weeksService.findOne(id, user._id.toString());
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
    @CurrentUser() user: UserDocument,
  ): Promise<WeekResponseDto> {
    return this.weeksService.update(id, updateWeekDto, user._id.toString());
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a week' })
  @ApiNotFoundResponse({ description: 'Week not found' })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: UserDocument,
  ): Promise<void> {
    return this.weeksService.remove(id, user._id.toString());
  }
}

