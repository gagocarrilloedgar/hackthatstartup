import * as mongoose from 'mongoose';
import { ModificationNote } from '../common/model';

const Schema = mongoose.Schema;

const schema = new Schema({
    place_data: {
        title: String,
        pic_url: String,
        place_location: String,
        description: String,
    },
    created_by: String,
    is_deleted: {
        type: Boolean,
        default: false
    },
    modification_notes: [ModificationNote]
});

export default mongoose.model('places', schema);