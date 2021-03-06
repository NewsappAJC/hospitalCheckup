DROP TABLE IF EXISTS ER_waits;


CREATE TABLE ER_waits (PRIMARY KEY (id))
SELECT DISTINCT a.provider_id AS id,
                a.hospital_name,
                b.HospitalName AS display_name,
                a.address,
                a.city,
                a.state,
                a.zip_code,
                a.county_name,
                MAX(CASE WHEN a.measure_id = 'EDV' THEN a.score END) AS er_volume,
                MAX(CASE WHEN a.measure_id = 'ED_1b' THEN a.score END) AS er_inpatient_1,
                MAX(CASE WHEN a.measure_id = 'ED_2b' THEN a.score END) AS er_inpatient_2,
                MAX(CASE WHEN a.measure_id = 'OP_18b' THEN a.score END) AS er_total_time_avg,
                MAX(CASE WHEN a.measure_id = 'OP_20' THEN a.score END) AS er_time_to_eval,
                MAX(CASE WHEN a.measure_id = 'OP_21' THEN a.score END) AS er_time_to_painmed,
                MAX(CASE WHEN a.measure_id = 'OP_22' THEN a.score END) AS er_left_pct,
                MAX(CASE WHEN a.measure_id = 'OP_23' THEN a.score END) AS er_ctresults_pct
FROM hospital_compare.HQI_HOSP_TimelyEffectiveCare a
JOIN hospital_names b ON a.provider_ID = b.ProviderNumber
WHERE condition_name = "Emergency Department"
  AND STATE = "GA"
GROUP BY a.provider_id;
