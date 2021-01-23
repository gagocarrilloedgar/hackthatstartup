import { ModificationNote } from "../common/model";

export interface IPlace {
    _id?: String;
    place_data: {
        title: String,
        pic_url: String, 
        place_location: String,
        description: String,
    },
    created_by: String,
    is_deleted?: Boolean,
    modification_notes: ModificationNote[]
}