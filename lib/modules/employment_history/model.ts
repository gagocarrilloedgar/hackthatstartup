export interface EmploymentHistory {
    id_work: String;
    company_name: String;
    company_location: String;
    started_on: Date;
    ended_on?: Date;
    is_deleted: Boolean;
}

export const EmploymentHistory = {
    id_work: String,
    company_name: String,
    company_location: String,
    started_on: Date,
    ended_on: Date,
    is_deleted: Boolean,
}