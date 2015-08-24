/*
Create perinatal data table for pregnency/delivery site.
Data available at https://dch.georgia.gov/health-planning-databases
(Annual Hospital Questionaire - 2000 to 2014)
*/

CREATE TABLE hospital_compare.perinatal
SELECT b.uid, b.Medicare_Provider_No,
       c.HospitalName,
       a.Delivery_Rms,
       a.Birthing_Rms,
       a.LDR_Rms,
       a.LDRP_Rms,
       a.C_Sect,
       a.Live_Births,
       a.Total_Births,
       a.Total_Deliveries,
       a.Beds_New_Born,
       a.Beds_Intermediate,
       a.Beds_Intensive,
       a.Adms_New_Born,
       a.Adms_Intermediate,
       a.Adms_Intensive,
       a.Days_New_Born,
       a.Days_Intermediate,
       a.Days_Intensive,
       round(a.C_Sect / a.Total_Births * 100, 0) as csection_pct,
       a.Avg_Delivery_Charge,
       a.Avg_Premature_Delivery_Charge,
       d.medicare_births,
       d.early_births,
       d.footnote
FROM ahq.perinatal a
JOIN ahq.lu_id b using(uid)
JOIN hospital_compare.hospital_names c
  ON c.providerNumber = b.Medicare_Provider_No
LEFT JOIN (
  SELECT provider_id,
         score as early_births,
         sample as medicare_births,
         footnote
  FROM hospital_compare.HQI_HOSP_TimelyEffectiveCare
  WHERE measure_id = 'PC_01'
) d ON b.Medicare_Provider_No = d.provider_id
WHERE a.year = 2013
  AND a.Total_Deliveries > 0
HAVING a.C_Sect / a.Total_Births < 1