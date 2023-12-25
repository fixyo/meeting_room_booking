import { PartialType } from '@nestjs/swagger';
import { CreateConferenceRoomDto } from './create-conference-room.dto';

export class UpdateConferenceRoomDto extends PartialType(CreateConferenceRoomDto) {}
