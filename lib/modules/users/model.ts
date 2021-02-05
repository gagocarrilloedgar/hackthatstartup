import { ModificationNote } from "../common/model";
import { AcademicHistory } from '../academic_history/model';
import { EmploymentHistory } from '../employment_history/model';

export interface IUser {
    _id?: String;
    name: {
        first_name: String;
        middle_name: String;
        last_name: String;
    };
    birth_date: Date;
    email: String;
    phone_number: String;
    social_links: String[];
    academic_history: AcademicHistory[];
    employment_history: EmploymentHistory[];
    is_deleted?: Boolean;
    modification_notes: ModificationNote[];
}