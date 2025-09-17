import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()  // ← Este controlador maneja la raíz: /
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()        // ← Ruta: / (devuelve "Hello World!")
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('equipo') // ← Ruta: /equipo (devuelve "Hola Equipo!")
  getEquipo(): string {
    return this.appService.getequipo();
  }}
