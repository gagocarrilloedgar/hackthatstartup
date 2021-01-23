import { IPlace } from './model';
import places from './schema';

export default class PlaceService {

    public createPlace(place_params: IPlace, callback: any) {
        const _session = new places(place_params);
        _session.save(callback);
    }

    public getAllPlaces(query: any, callback: any) {
        places.find(query, callback);
    }

    public filterPlace(query: any, callback: any) {
        places.findOne(query, callback);
    }

    public updatePlace(place_params: IPlace, callback: any) {
        const query = { _id: place_params._id };
        places.findOneAndUpdate(query, place_params, callback);
    }

    public deletePlace(_id: String, callback: any) {
        const query = { _id: _id };
        places.findOneAndUpdate(query, { is_deleted: true }, callback);
    }

}