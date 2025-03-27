import { Global, Module } from '@nestjs/common';
import { WebsocketsService } from './websockets.service';

@Global()
@Module({
  providers: [WebsocketsService],
  exports: [WebsocketsService], // Allow other modules to use it
})
export class WebsocketModule {}
