import { Module } from '@nestjs/common';
import { ConferenceRoomService } from './conference-room.service';
import { ConferenceRoomController } from './conference-room.controller';

@Module({
  controllers: [ConferenceRoomController],
  providers: [ConferenceRoomService],
})
export class ConferenceRoomModule {}
