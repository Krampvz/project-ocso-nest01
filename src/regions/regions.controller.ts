import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { RegionsService } from './regions.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';

@Controller('regions')
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Post()
  create(@Body() createRegionDto: CreateRegionDto) {
    return this.regionsService.create(createRegionDto);
  }

  @Get()
  findAll() {
    return this.regionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { // ← ParseIntPipe + number
    return this.regionsService.findOne(id); // ← Sin +
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateRegionDto: UpdateRegionDto) {
    return this.regionsService.update(id, updateRegionDto); // ← Sin +
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.regionsService.remove(id); // ← Sin +
  }
}