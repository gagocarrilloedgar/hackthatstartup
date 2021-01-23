import { Request, Response } from 'express';
import { insufficientParameters, mongoError, successResponse, failureResponse } from '../modules/common/service';
import { IUser } from '../modules/users/model';
import UserService from '../modules/users/service';
import { isAllFieldsInsideAcademicHistoryCorrect, isAllFieldsInsideEmploymentHistoryCorrect } from '../middleware/checkArrays';
import e = require('express');

export class UserController {

    private user_service: UserService = new UserService();

    public create_user(req: Request, res: Response) {
        var academyRecord = [];
        var employmentRecord = [];

        //here I check if inside the academic history array the user is missing some field 
        req.body.academic_history.forEach((academicRecord: any) => {

            if (isAllFieldsInsideAcademicHistoryCorrect(academicRecord) == 'ok') {
                academyRecord.push(academicRecord);
                //console.log('inside foreach ' + academicRecord)
            } else {
                throw new Error('Missing data inside academic record');
            }

        });
        //here I check if inside the employment history array the user is missing some field 
        req.body.employment_history.forEach((empRecord: any) => {
            if (isAllFieldsInsideEmploymentHistoryCorrect(empRecord) == 'ok') {
                employmentRecord.push(empRecord);
            } else {
                throw new Error('Missing data inside employment record');
            }
        });
        // this check whether all the fields were send through the request or not
        if (req.body.name && req.body.name.first_name &&
            req.body.name.middle_name && req.body.name.last_name &&
            req.body.birth_date && req.body.email && req.body.phone_number &&
            req.body.social_links &&
            (academyRecord.length != 0 && academyRecord !== undefined)) {

            const user_params: IUser = {
                name: {
                    first_name: req.body.name.first_name,
                    middle_name: req.body.name.middle_name,
                    last_name: req.body.name.last_name
                },
                birth_date: req.body.birth_date,
                email: req.body.email,
                phone_number: req.body.phone_number,
                social_links: req.body.social_links,
                academic_history: academyRecord,
                employment_history: employmentRecord,
                modification_notes: [{
                    modified_on: new Date(Date.now()),
                    modified_by: req.body.name.first_name,
                    modification_note: 'New user created'
                }]
            };

            this.user_service.createUser(user_params, (err: any, user_data: IUser) => {
                if (err) {
                    mongoError(err, res);
                } else {
                    successResponse('create user successfull', user_data, res);
                }
            });
        } else {
            // error response if some fields are missing in request body
            insufficientParameters(res);
        }
    }

    public get_user(req: Request, res: Response) {
        if (req.params.id) {
            const user_filter = { _id: req.params.id, is_deleted: false };
            this.user_service.filterUser(user_filter, (err: any, user_data: IUser) => {
                if (err) {
                    mongoError(err, res);
                } else {
                    successResponse('Get user successfull', user_data, res);
                }
            });
        } else {
            insufficientParameters(res);
        }
    }

    public get_all_users(req: Request, res: Response) {
        const user_filter = { is_deleted: false };
        const users_data = this.user_service.getAllUsers(user_filter, (err: any, user_data: IUser) => {
            if (err) {
                mongoError(err, res);
            } else {
                successResponse('Get users list successful', user_data, res);
            }
        });
    }

    public update_basic_user_info(req: Request, res: Response) {
        if (req.params.id &&
            req.body.name || req.body.name.first_name || req.body.name.middle_name || req.body.name.last_name ||
            req.body.birth_date || req.body.email ||
            req.body.phone_number || req.body.social_links) {
            const user_filter = { _id: req.params.id, is_deleted: false };
            this.user_service.filterUser(user_filter, (err: any, user_data: IUser) => {
                if (err) {
                    mongoError(err, res);
                } else if (user_data) {
                    user_data.modification_notes.push({
                        modified_on: new Date(Date.now()),
                        modified_by: req.body.name.first_name,
                        modification_note: 'User data updated'
                    });
                    const user_params: IUser = {
                        _id: req.params.id,
                        name: req.body.name ? {
                            first_name: req.body.name.first_name ? req.body.name.first_name : user_data.name.first_name,
                            middle_name: req.body.name.middle_name ? req.body.name.middle_name : user_data.name.middle_name,
                            last_name: req.body.name.last_name ? req.body.name.last_name : user_data.name.last_name
                        } : user_data.name,
                        birth_date: req.body.birth_date ? req.body.birth_date : user_data.birth_date,
                        email: req.body.email ? req.body.email : user_data.email,
                        phone_number: req.body.phone_number ? req.body.phone_number : user_data.phone_number,
                        social_links: req.body.social_links ? req.body.social_links : user_data.social_links,
                        academic_history: user_data.academic_history,
                        employment_history: user_data.employment_history,
                        is_deleted: req.body.is_deleted ? req.body.is_deleted : user_data.is_deleted,
                        modification_notes: user_data.modification_notes
                    };
                    this.user_service.updateBasicUserInfo(user_params, (err: any) => {
                        if (err) {
                            mongoError(err, res);
                        } else {
                            successResponse('update user info successfull', null, res);
                        }
                    });
                } else {
                    failureResponse('invalid user', null, res);
                }
            });
        } else {
            insufficientParameters(res);
        }
    }


    public update_academy_history(req: Request, res: Response) {
        if (req.params.studyId && req.params.id) {
            console.log('controller ' +  req.params.id)
            const academyRecordFilter = { _id: req.params.id };
            this.user_service.filterUser(academyRecordFilter, (err:any, academyData: any) => {
                const academyRecordParams = {
                    _id: req.params.studyId,
                    id_user: req.params.id,
                    id_study: req.params.id_study,
                    study_field: req.body.study_field ? req.body.study_field : academyData.study_field,
                    center_name: req.body.center_name ? req.body.center_name : academyData.center_name,
                    center_location: req.body.center_location ? req.body.center_location : academyData.center_location,
                    started_on: req.body.started_on ? req.body.started_on : academyData.started_on,
                    ended_on: req.body.ended_on ? req.body.ended_on : academyData.ended_on,
                    is_deleted: false
                };
                this.user_service.updateAcademyHistory(academyRecordParams, (err: any) => {
                    if (err) {
                        mongoError(err, res);
                    } else {
                        successResponse('update academy record info successfull', academyData, res);
                    }
                });
            });
        }
    }
    public update_work_history(req: Request, res: Response) {

    }

    public delete_user(req: Request, res: Response) {
        if (req.params.id) {
            const userFilter = { _id: req.params.id };
            this.user_service.filterUser(userFilter, (err: any, user_data: IUser) => {
                if (err) {
                    mongoError(err, res);
                } else if (user_data && user_data.is_deleted !== true) {
                    this.user_service.deleteUser(req.params.id, (err: any) => {
                        if (err) {
                            mongoError(err, res);
                        } else {
                            successResponse('User deleted sucessfully', null, res);
                        }
                    });
                }
            });
        } else {
            insufficientParameters(res);
        }
    }
}