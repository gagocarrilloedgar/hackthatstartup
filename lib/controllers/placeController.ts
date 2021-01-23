import { Request, Response } from 'express';
import { insufficientParameters, mongoError, successResponse, failureResponse } from '../modules/common/service';
import { IPlace } from '../modules/places/model';
import PlaceService from '../modules/places/service';
import e = require('express');

export class PlaceController {

    private place_service: PlaceService = new PlaceService();

    public create_place(req: Request, res: Response) {
        if (req.body.place_data && req.body.place_data.title && req.body.place_data.pic_url
            && req.body.place_data.place_location && req.body.place_data.description
            && req.body.created_by) {
            const place_params: IPlace = {
                place_data: {
                    title: req.body.place_data.title,
                    pic_url: req.body.place_data.pic_url,
                    place_location: req.body.place_data.place_location,
                    description: req.body.place_data.description,
                },
                created_by: req.body.created_by,
                is_deleted: false,
                modification_notes: [{
                    modified_on: new Date(Date.now()),
                    modified_by: null,
                    modification_note: 'New place created'
                }],
            };
            this.place_service.createPlace(place_params, (err: any, place_data: IPlace) => {
                if (err) {
                    mongoError(err, res);
                } else {
                    successResponse('place created successfully', place_data, res);
                }
            })
        } else {
            insufficientParameters(res);
        }
    }

    public get_all_places(req: Request, res: Response) {
        const place_filter = { is_deleted: false };
        const place_data = this.place_service.getAllPlaces(place_filter, (err: any, place_data: IPlace) => {
            if (err) {
                mongoError(err, res);
            } else {
                successResponse('get places list successful', place_data, res);
            }
        });
    }

    public get_place(req: Request, res: Response) {
        if (req.params.id) {
            const place_filter = { _id: req.params.id, is_deleted: false };
            this.place_service.filterPlace(place_filter, (err: any, place_data: IPlace) => {
                if (err) {
                    mongoError(err, res);
                } else {
                    if(place_data == null){
                        successResponse('Place is no longer available', null, res);
                    } else {
                        successResponse('get place successful', place_data, res);
                    }
                }
            })
        } else {
            insufficientParameters(res);
        }
    }

    public update_place(req: Request, res: Response) {
        if (req.params.id &&
            req.body.place_data && req.body.place_data.title && req.body.place_data.pic_url
            && req.body.place_data.place_location && req.body.place_data.description
            && req.body.created_by
        ) {
            const place_filter = { _id: req.params.id };
            this.place_service.filterPlace(place_filter, (err: any, place_data: IPlace) => {
                if (err) {
                    mongoError(err, res);
                } else if (place_data) {
                    place_data.modification_notes.push({
                        modified_on: new Date(Date.now()),
                        modified_by: req.body.created_by,
                        modification_note: 'Place data updated successfully'
                    });
                    const place_params: IPlace = {
                        _id: req.params.id,
                        place_data: req.body.place_data ? {
                            title: req.body.place_data.title ? req.body.place_data.title : place_data.place_data.title,
                            pic_url: req.body.place_data.pic_url ? req.body.place_data.pic_url : place_data.place_data.pic_url,
                            place_location: req.body.place_data.place_location ? req.body.place_data.place_location : place_data.place_data.place_location,
                            description: req.body.place_data.description ? req.body.place_data.description : place_data.place_data.description,
                        } : place_data.place_data,
                        created_by: req.body.created_by ? req.body.created_by : place_data.created_by,
                        is_deleted: false,
                        modification_notes: place_data.modification_notes,
                    }
                    this.place_service.updatePlace(place_params, (err: any) => {
                        if (err) {
                            mongoError(err, res);
                        } else {
                            successResponse('update place successful', place_params, res);
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

    public delete_place(req: Request, res: Response) {
        if (req.params.id) {
            const placeFilter = { _id: req.params.id };
            this.place_service.filterPlace(placeFilter, (err: any, place_data: IPlace) => {
                if (err) {
                    mongoError(err, res);
                } else if (place_data && place_data.is_deleted !== true) {
                    this.place_service.deletePlace(req.params.id, (err: any) => {
                        if (err) {
                            mongoError(err, res);
                        } else {
                            successResponse('place deleted sucessfully', null, res);
                        }
                    });
                }
            });
        } else {
            insufficientParameters(res);
        }
    }

}