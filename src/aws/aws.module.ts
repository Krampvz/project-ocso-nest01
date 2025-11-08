import { Module, Injectable } from '@nestjs/common';

@Injectable()
export class AwsService {

}

@Module({
  providers: [AwsService],
  exports: [AwsService],
})
export class AwsModule {}
