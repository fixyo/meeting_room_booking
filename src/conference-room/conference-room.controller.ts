import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConferenceRoomService } from './conference-room.service';
import { CreateConferenceRoomDto } from './dto/create-conference-room.dto';
import { UpdateConferenceRoomDto } from './dto/update-conference-room.dto';

@Controller('conference-room')
export class ConferenceRoomController {
  constructor(private readonly conferenceRoomService: ConferenceRoomService) {}

  @Post()
  create(@Body() createConferenceRoomDto: CreateConferenceRoomDto) {
    return this.conferenceRoomService.create(createConferenceRoomDto);
  }

  @Get()
  findAll() {
    return this.conferenceRoomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conferenceRoomService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConferenceRoomDto: UpdateConferenceRoomDto) {
    return this.conferenceRoomService.update(+id, updateConferenceRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conferenceRoomService.remove(+id);
  }
}
