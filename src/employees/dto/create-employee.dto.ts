import { IsEmail, IsString, IsObject, MaxLength, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Location } from "src/locations/entities/location.entity"; 

export class LocationEmployeeDto {
    @ApiProperty()
    locationId: number;

     @ApiProperty()
     
    locationName: string;
    
     @ApiProperty()
    locationLatLng: number[];

     @ApiProperty()
    locationAdress: string;

}

export class CreateEmployeeDto {
    @ApiProperty()
    @IsString()
    @MaxLength(30)
    employeeName: string; 

    @ApiProperty()
    @IsString()
    @MaxLength(70)
    employeeLastName: string; 


    @ApiProperty()
    @IsString()
    @MaxLength(10)
    employeePhoneNumber: string; 

    @ApiProperty()
    @IsEmail()
    employeeEmail: string; 

    @ApiPropertyOptional ()
    @IsOptional()
    @IsObject()
    location: LocationEmployeeDto;
}