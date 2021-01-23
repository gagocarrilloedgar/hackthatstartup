import * as mongoose from 'mongoose';
import { ModificationNote } from '../common/model';
import { AcademicHistory } from '../academic_history/model';
import { EmploymentHistory } from '../employment_history/model';

const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: {
            first_name: String,
            middle_name: String,
            last_name: String
        }
    },
    birth_date: Date,
    email: String,
    phone_number: String,
    social_links: [String],
    academic_history: [AcademicHistory],
    employment_history: [EmploymentHistory],
    is_deleted: {
        type: Boolean,
        default: false
    },
    modification_notes: [ModificationNote]
});

export default mongoose.model('users', schema);