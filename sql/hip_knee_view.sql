DROP VIEW IF EXISTS hospital_compare.hip_knee;

CREATE VIEW hip_knee AS
SELECT a.ProviderNumber,
       a.HospitalName,
       b.address as Adress,
       b.City,
       b.State,
       b.zip_code as zipCode,
       b.county_name as CountyName,

       /* Rate of readmission after hip/knee surgery */
       b.compared_to_national as readmissions_category,
       b.footnote as readmission_notes,
       b.denominator as readmission_patients,
       b.score as readmission_rsrr,
       b.lower_estimate as readmission_lower,
       b.higher_estimate as readmission_upper,

       /* Rate of complications for hip/knee replacement patients */
       c.compared_to_national as cd_category,
       c.footnote as cd_notes,
       c.denominator as cd_patients,
       c.score as cd_rscr,
       c.lower_estimate as cd_lower,
       c.higher_estimate as cd_upper

FROM hospital_compare.hospital_names a

LEFT JOIN hospital_compare.readmissions_deaths_hosp b
       ON b.provider_id = a.ProviderNumber
      AND b.measure_id  = 'READM_30_HIP_KNEE'

LEFT JOIN hospital_compare.complications_hosp c
       ON c.provider_id = a.ProviderNumber
      AND c.measure_id  = 'COMP_HIP_KNEE';
