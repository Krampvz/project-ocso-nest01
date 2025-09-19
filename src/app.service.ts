import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getequipo(): string {
    return 'Hola Equipo!';
  }


  getEmployees(): string {
    return 'Lista de empleados!';
  }
}






