import { CreateEventDto } from './dtos/CreateEvent.dot';
import EventModel, { IEvent } from './models/Event';
import UserModel from '../auth/models/User';


class EventService {
  
    async getEventById(id: string): Promise<IEvent | null> {
      return await EventModel.findById(id).exec();
    }

    async getEvents(userPayload: any, page: number, sort: string, sortBy: string): Promise<IEvent[]> {
        const user = await UserModel.findById(userPayload.id).exec();
        const perPage = 3;

        const city = user === null ? "asd" : user.city;
        const sortS = (sort === 'desc' ? '-' : '') + sortBy;
        console.log(sortS)
        return await EventModel.find({
                city: city
            })
            .limit(perPage)
            .skip(perPage * (page - 1))
            .sort(sortS)
            .exec();
    }

    async createEvent(createEventDto: CreateEventDto): Promise<IEvent> {
      const { name, description, date, city ,duration} = createEventDto;
      const newEvent = new EventModel({
        name,
        description,
        date: new Date(date),
        city,
        duration
      });
  
      await newEvent.save();
      return newEvent;
    }
  
    
  }
  
  export default EventService;
  