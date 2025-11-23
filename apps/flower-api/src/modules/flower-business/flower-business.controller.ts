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
import { FlowerBusinessService } from './flower-business.service';
import {
  CreateFlowerWeekRequestDTO,
  UpdateFlowerWeekRequestDTO,
  FlowerWeekResponseDTO,
  FlowerWeekSummaryResponseDTO,
} from './dto/flower-business.dto';

@ApiTags('flower-business')
@Controller('flower-weeks')
export class FlowerBusinessController {
  constructor(
    private readonly flowerBusinessService: FlowerBusinessService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new flower week' })
  @ApiCreatedResponse({
    type: FlowerWeekResponseDTO,
    description: 'Flower week created successfully',
  })
  @ApiConflictResponse({ description: 'Week already exists' })
  create(@Body() createDto: CreateFlowerWeekRequestDTO) {
    return this.flowerBusinessService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all flower weeks' })
  @ApiOkResponse({
    type: [FlowerWeekResponseDTO],
    description: 'List of all flower weeks',
  })
  findAll() {
    return this.flowerBusinessService.findAll();
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get summary statistics' })
  @ApiOkResponse({
    type: FlowerWeekSummaryResponseDTO,
    description: 'Summary statistics',
  })
  getSummary() {
    return this.flowerBusinessService.getSummary();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a flower week by ID' })
  @ApiOkResponse({
    type: FlowerWeekResponseDTO,
    description: 'Flower week found',
  })
  @ApiNotFoundResponse({ description: 'Flower week not found' })
  findOne(@Param('id') id: string) {
    return this.flowerBusinessService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a flower week' })
  @ApiOkResponse({
    type: FlowerWeekResponseDTO,
    description: 'Flower week updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Flower week not found' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateFlowerWeekRequestDTO,
  ) {
    return this.flowerBusinessService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a flower week' })
  @ApiNotFoundResponse({ description: 'Flower week not found' })
  remove(@Param('id') id: string) {
    return this.flowerBusinessService.remove(id);
  }
}

