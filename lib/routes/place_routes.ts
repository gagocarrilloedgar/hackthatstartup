import { Application, request, Request, Response } from 'express';
import { PlaceController } from '../controllers/placeController';

export class PlaceRoutes {
    
    private place_controller: PlaceController = new PlaceController();

    public route(app: Application){

        app.get('/api/place/getPlaces', (req: Request, res: Response) => {
            this.place_controller.get_all_places(req, res);
        });

        app.get('/api/place/getPlace/:id', (req: Request, res: Response) => {
            this.place_controller.get_place(req, res);
        });

        app.post('/api/place/createPlace', (req: Request, res: Response)=> {
            this.place_controller.create_place(req, res);
        });

        app.put('/api/place/updatePlace/:id', (req: Request, res: Response) => {
            this.place_controller.update_place(req, res);
        });

        app.put('/api/place/deletePlace/:id', (req: Request, res: Response) => {
            this.place_controller.delete_place(req, res);
        });
    }

}