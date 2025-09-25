import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { RegionsService } from './regions.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ROLES } from 'src/auth/constants/roles.constants';
import { ApiAuth } from "src/auth/decorators/api.decorator";

@ApiAuth()
@Controller('regions')
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Auth()
  @Post()
  create(@Body() createRegionDto: CreateRegionDto) {
    return this.regionsService.create(createRegionDto);
  }

  @Auth(ROLES.EMPLOYEE, ROLES.MANAGER)
  @Get()
  findAll() {
    return this.regionsService.findAll();
  }

  @Auth(ROLES.EMPLOYEE, ROLES.MANAGER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { // ← ParseIntPipe + number
    return this.regionsService.findOne(id); // ← Sin +
  }

  @Auth()
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateRegionDto: UpdateRegionDto) {
    return this.regionsService.update(id, updateRegionDto); // ← Sin +
  }

  @Auth()
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.regionsService.remove(id); // ← Sin +
  }
}