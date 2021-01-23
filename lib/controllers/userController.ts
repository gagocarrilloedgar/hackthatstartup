import { Request, Response } from 'express';
import { insufficientParameters, mongoError, successResponse, failureResponse } from '../modules/common/service';
import { IUser } from '../modules/users/model';
import UserService from '../modules/users/service';
import { isAllFieldsInsideWorkHistoryCorrect, isAllFieldsInsideEmpleymentHistoryCorrect } from '../middleware/checkArrays';
import e = require('express');

export class UserController {

    private user_service: UserService = new UserService();

    public create_user(req: Request, res: Response) {
        var academyRecord = [];
        var employmentRecord = [];
        req.body.academic_history.forEach((academicRecord: any) => {

            if (isAllFieldsInsideWorkHistoryCorrect(academicRecord) == 'ok') {
                academyRecord.push(academicRecord);
            }
            throw new Error('Missing data inside academic record');

        });

        req.body.employment_history.forEach((employmentRecord: any) => {
            if (isAllFieldsInsideEmpleymentHistoryCorrect(employmentRecord) == 'ok') {
                employmentRecord.push(employmentRecord);
            } 
            throw new Error('Missing data inside employment record');
        });
        // this check whether all the fields were send through the request or not
        if (req.body.name && req.body.name.first_name &&
            req.body.name.middle_name && req.body.name.last_name &&
            req.body.birth_date && req.body.email && req.body.phone_number &&
            req.body.social_links && req.body.academic_history && req.body.employment_history &&
            (academyRecord.length != 0 && academyRecord !== undefined)) {

            const checkEmploymentHistory = req.body.employment_history;
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
                    modified_by: req.body.name,
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
            const user_filter = { _id: req.params.id };
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
        const user_filter = {};
        const users_data = this.user_service.getAllUsers(user_filter, (err: any, user_data: IUser) => {
            if (err) {
                mongoError(err, res);
            } else {
                successResponse('Get users list successful', user_data, res);
            }
        });
    }
/*
    public update_user(req: Request, res: Response) {
        if (req.params.id &&
            req.body.name || req.body.name.first_name || req.body.name.middle_name || req.body.name.last_name ||
            req.body.birth_date || req.body.email ||
            req.body.phone_number || req.body.social_links ||
            req.body.academic_history || req.body.employment_history) {
            const user_filter = { _id: req.params.id };
            this.user_service.filterUser(user_filter, (err: any, user_data: IUser) => {
                if (err) {
                    mongoError(err, res);
                } else if (user_data) {
                    user_data.modification_notes.push({
                        modified_on: new Date(Date.now()),
                        modified_by: req.body.name,
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
                        is_deleted: req.body.is_deleted ? req.body.is_deleted : user_data.is_deleted,
                        modification_notes: user_data.modification_notes
                    };
                    this.user_service.updateUser(user_params, (err: any) => {
                        if (err) {
                            mongoError(err, res);
                        } else {
                            successResponse('update user successfull', null, res);
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
    */

    public delete_user(req: Request, res: Response) {
        if (req.params.id) {
            this.user_service.deleteUser(req.params.id, (err: any, delete_details: { deletedCount: number; }) => {
                if (err) {
                    mongoError(err, res);
                } else if (delete_details.deletedCount !== 0) {
                    successResponse('delete user successfull', null, res);
                } else {
                    failureResponse('invalid user', null, res);
                }
            });
        } else {
            insufficientParameters(res);
        }
    }
}