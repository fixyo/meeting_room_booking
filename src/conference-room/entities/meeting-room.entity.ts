import dayjs from "dayjs";
import { Column, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

export class MeetingRoom {
  @PrimaryGeneratedColumn()
  id: number 

  @Column({
    length: 50,
    comment: 'room name'
  })
  name: string 

  @Column()
  capacity: number 

  @Column({
    length: 50,
    comment: 'location of the room'
  })
  location: string 

  @Column({
    length: 50, 
    comment: 'equipment',
    default: ''
  })
  equipment: string 

  @Column({
    length: 100,
    comment: 'description',
    default: ''
  })
  description: string 

  @Column({
    default: false,
    comment: 'occupied or not'
  })
  isBooked: boolean 

  @Column({
    transformer: {
      from: (v) => dayjs(v).format('YYYY-MM-DD HH:mm:ss'),
      to: (v) => v
    }
  })
  createAt: Date 

  @Column({
    transformer: {
      from: v => dayjs(v).format('YYYY-MM-DD HH:mm:ss'),
      to: v => v
    }
  })
  updateAt: Date 
}