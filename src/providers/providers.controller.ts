import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  NotFoundException,
  UseGuards,
  UnauthorizedException
} from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { User } from '../auth/entities/user.entity';
import { AuthGuard } from '../auth/guards/auth-guard';
import { UserData } from '../auth/decorators/user.decorator';

@UseGuards(AuthGuard)
@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post()
  create(@Body() createProviderDto: CreateProviderDto) {
    return this.providersService.create(createProviderDto);
  }

  @Get()
findAll(@UserData() user: User) {
    if (user.userRoles.includes("Employee")) throw new UnauthorizedException("No estas autorizado, solo admins y managers");
    return this.providersService.findAll();
}

  @Get('/name/:name')
  async findByName(@Param('name') name: string) {
    const provider = await this.providersService.findOneByName(name);
    if (!provider) throw new NotFoundException(`Provider ${name} not found`);
    return provider;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const provider = await this.providersService.findOne(id);
    if (!provider) throw new NotFoundException();
    return provider;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProviderDto: UpdateProviderDto) {
    return this.providersService.update(id, updateProviderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.providersService.remove(id);
  }
}