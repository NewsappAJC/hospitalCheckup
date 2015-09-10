DROP VIEW IF EXISTS hospital_compare.hip_knee;

CREATE VIEW hip_knee AS
SELECT a.ProviderNumber as provider_id,
       a.HospitalName as ajc_hospital_name,
       b.address,
       b.City as city,
       b.State as state,
       b.zip_code,
       b.county_name,

       /* Rate of readmission after hip/knee surgery */
       b.compared_to_national as readmissions_category,
       b.footnote as readmissions_notes,
       b.denominator as readmissions_patients,
       b.score as readmissions_rate,
       b.lower_estimate as readmissions_lower,
       b.higher_estimate as readmissions_upper,

       /* Rate of complications for hip/knee replacement patients */
       c.compared_to_national as complications_category,
       c.footnote as complications_notes,
       c.denominator as complications_patients,
       c.score as complications_rate,
       c.lower_estimate as complications_lower,
       c.higher_estimate as complications_upper

FROM hospital_compare.hospital_names a

LEFT JOIN hospital_compare.readmissions_deaths_hosp b
       ON b.provider_id = a.ProviderNumber
      AND b.measure_id  = 'READM_30_HIP_KNEE'

LEFT JOIN hospital_compare.complications_hosp c
       ON c.provider_id = a.ProviderNumber
      AND c.measure_id  = 'COMP_HIP_KNEE';
