//checking errors inside academic history object
export const isAllFieldsInsideAcademicHistoryCorrect = (
    academicData: { id_study: any, study_field: any; center_name: any; center_location: any; started_on: any; }) => {
    if (academicData.id_study) {
        if (academicData.id_study && academicData.study_field && academicData.center_name &&
            academicData.center_location && academicData.started_on) {
            console.log('ok');
            return 'ok';
        }
        return 'ko';
    }
}
//checking errors inside work history object

export const isAllFieldsInsideEmploymentHistoryCorrect = (
    employmentData: { id_work: any; company_name: any; company_location: any; started_on: any; }) => {
    if (employmentData.id_work) {
        if (employmentData.company_name &&
            employmentData.company_location && employmentData.started_on) {
            console.log('ok');
            return 'ok';
        }
        return 'ko';
    }
}


