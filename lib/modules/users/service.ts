import { userInfo } from 'os';
import { IUser } from './model';
import users from './schema';

export default class UserService {

    public createUser(user_params: IUser, callback: any) {
        const _session = new users(user_params);
        _session.save(callback);
    }

    public filterUser(query: any, callback: any) {
        users.findOne(query, callback);
    }

    public getAllUsers(query: any, callback: any) {
        users.find(query, callback);
    }

    public updateBasicUserInfo(user_params: IUser, callback: any) {
        const query = { _id: user_params._id };
        users.findOneAndUpdate(query, user_params, callback);
    }

    public updateAcademyHistory(academyParams: any, callback: any) {
        console.log(academyParams._id);
        const clearAcademyParams = {
                id_study: academyParams.id_study,
                study_field: academyParams.study_field,
                center_name: academyParams.center_name,
                center_location: academyParams.center_location,
                started_on: academyParams.started_on,
                ended_on: academyParams.ended_on,
                is_deleted: false
        };
        const query = { academic_history: { _id: academyParams._id } };
        users.findOneAndUpdate(query, clearAcademyParams, callback);
    }

    public deleteUser(_id: String, callback: any) {
        const query = { _id: _id };
        users.findOneAndUpdate(query, { is_deleted: true }, callback);
    }

}