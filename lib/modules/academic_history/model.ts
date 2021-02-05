export interface AcademicHistory {
    id_study: String;
    study_field: String;
    center_name: String;
    center_location: String;
    started_on: Date;
    ended_on?: Date;
    is_deleted: Boolean;
}

export const AcademicHistory = {
    id_study: String,
    study_field: String,
    center_name: String,
    center_location: String,
    started_on: Date,
    ended_on: Date,
    is_deleted: Boolean,
}