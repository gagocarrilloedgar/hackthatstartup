import { Application, request, Request, Response } from 'express';
import { UserController } from '../controllers/userController';

export class UserRoutes {

    private user_controller: UserController = new UserController();

    public route(app: Application) {
        
        app.post('/api/user', (req: Request, res: Response) => {
            this.user_controller.create_user(req, res);
        });

        app.get('/api/user/getAll', (req: Request, res: Response) => {
            this.user_controller.get_all_users(req, res);
        });

        app.get('/api/user/:id', (req: Request, res: Response) => {
            this.user_controller.get_user(req, res);
        });

        app.put('/api/user/updateBasicInfo/:id', (req: Request, res: Response) => {
            this.user_controller.update_basic_user_info(req, res);
        });

        app.put('/api/user/updateAcademyData/:id/:studyId', (req: Request, res: Response) => {
            this.user_controller.update_academy_history(req, res);
        });
        
        app.put('/api/user/delete/:id', (req: Request, res: Response) => {
            this.user_controller.delete_user(req, res);
        });

    }
}