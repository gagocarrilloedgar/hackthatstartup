import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import {DB_CONNECTION } from "../constants/env-constants";
import { UserRoutes } from "../routes/user_routes";
import { CommonRoutes } from "../routes/common_routes";
import { PlaceRoutes } from "../routes/place_routes";
class App {

   public app: express.Application;
   public mongoUrl: string = DB_CONNECTION;

   private user_routes: UserRoutes = new UserRoutes();
   private place_routes: PlaceRoutes = new PlaceRoutes();
   private common_routes: CommonRoutes = new CommonRoutes();


   constructor() {
      this.app = express();
      this.config();
      this.mongoSetup();
      this.user_routes.route(this.app);
      this.place_routes.route(this.app);
      this.common_routes.route(this.app);
   }

   private config(): void {
      // support application/json type post data
      this.app.use(bodyParser.json());
      //support application/x-www-form-urlencoded post data
      this.app.use(bodyParser.urlencoded({ extended: true }));
   }


   private mongoSetup(): void {
      try {
      mongoose.connect(
         this.mongoUrl,
         {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
         });
      } catch (err){
         return err;
      }
   }

}
export default new App().app;