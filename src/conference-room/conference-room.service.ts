import { Injectable } from '@nestjs/common';
import { CreateConferenceRoomDto } from './dto/create-conference-room.dto';
import { UpdateConferenceRoomDto } from './dto/update-conference-room.dto';

@Injectable()
export class ConferenceRoomService {
  create(createConferenceRoomDto: CreateConferenceRoomDto) {
    return 'This action adds a new conferenceRoom';
  }

  findAll() {
    return `This action returns all conferenceRoom`;
  }

  findOne(id: number) {
    return `This action returns a #${id} conferenceRoom`;
  }

  update(id: number, updateConferenceRoomDto: UpdateConferenceRoomDto) {
    return `This action updates a #${id} conferenceRoom`;
  }

  remove(id: number) {
    return `This action removes a #${id} conferenceRoom`;
  }
}
