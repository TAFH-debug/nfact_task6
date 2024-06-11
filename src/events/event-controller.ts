import { Request, Response } from 'express';
import { CreateEventDto } from './dtos/CreateEvent.dot';
import EventService from './event-service';

class EventController {
    private eventService : EventService;


    constructor(eventService : EventService){
        this.eventService = eventService;
    }

    createEvent = async (req: Request, res: Response): Promise<void> => {
        try {
            const createEventDto: CreateEventDto = req.body;
            const event = await this.eventService.createEvent(createEventDto);
            res.status(201).json(event);
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }

    getEvents = async (req: Request, res: Response): Promise<void> => {
        if (req.user === undefined) {
            res.status(500).json({ message: 'No user found.' });
            return
        }
        try {
            const page = req.query.page;
            const a = typeof page === "string" ? parseInt(page) : 1;
            const sort = typeof req.query.sortDirection === "string" ? req.query.sortDirection : "asc";
            const sortBy = typeof req.query.sortBy === "string" ? req.query.sortBy : "name";
            const events = await this.eventService.getEvents(req.user, a, sort, sortBy);
            res.status(200).json(events);
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }

    getEventById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const event = await this.eventService.getEventById(id);
            if (!event) {
              res.status(404).json({ message: 'Event not found' });
              return;
            }
            res.status(200).json(event);
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }
}

export default EventController;