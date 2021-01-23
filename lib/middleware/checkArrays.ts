    
    export const isAllFieldsInsideWorkHistoryCorrect = (
        academicData: { study_field: any; center_name: any; center_location: any; started_on: any; }) =>  {
        if (academicData) {
            if (academicData.study_field && academicData.center_name &&
                academicData.center_location && academicData.started_on) {
                return 'ok';
            }
            return 'ko';
        }
    }

    export const isAllFieldsInsideEmpleymentHistoryCorrect = (
        employmentData: { center_name: any; company_name: any; company_location: any; started_on: any; }) => {
        if (employmentData) {
            if (employmentData.center_name && employmentData.company_name &&
                employmentData.company_location && employmentData.started_on) {
                return 'ok';
            }
            return 'ko';
        }
    }


