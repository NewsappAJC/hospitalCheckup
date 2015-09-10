/*
Create perinatal data table for pregnency/delivery site.
Data available at https://dch.georgia.gov/health-planning-databases
(Annual Hospital Questionaire - 2000 to 2014)
*/

/*NOTES: Total_Deliveries includes abortions so don't use it. State uses Total_Births (which does include late term miscariages)*/
DROP TABLE IF EXISTS hospital_compare.perinatal; -- if it says table already exists run this by itself first
CREATE TABLE hospital_compare.perinatal
SELECT b.uid,
       b.Medicare_Provider_No as provider_id,
       c.HospitalName as ajc_hospital_name,
       d.address,
       d.city,
       a.Delivery_Rms,
       a.Birthing_Rms,
       a.LDR_Rms,
       a.LDRP_Rms,
       a.C_Sect,
       a.Live_Births,
       a.Total_Births as total_births,
       round(a.C_Sect / a.Total_Births * 100, 0) as csect_pct,
       a.Avg_Delivery_Charge as avg_delivery_charge,
       a.Avg_Premature_Delivery_Charge as avg_premature_charge,
       d.medicare_births, -- this might actually be sample size
       d.early_births_pct,
       d.early_footnote,
       -- not currently using any of these but for now grabbing them anyway in case we want them historically later
       a.Total_Deliveries, -- includes abortions
       a.Beds_New_Born,
       a.Beds_Intermediate,
       a.Beds_Intensive,
       a.Adms_New_Born,
       a.Adms_Intermediate,
       a.Adms_Intensive,
       a.Days_New_Born,
       a.Days_Intermediate,
       a.Days_Intensive
FROM ahq.perinatal a
JOIN ahq.lu_id b using(uid)
JOIN hospital_compare.hospital_names c
  ON c.providerNumber = b.Medicare_Provider_No
LEFT JOIN (
  SELECT provider_id,
         address,
         city,
         score as early_births_pct,
         sample as medicare_births, /*check on what this is, might be sample size*/
         footnote as early_footnote
  FROM hospital_compare.HQI_HOSP_TimelyEffectiveCare
  WHERE measure_id = 'PC_01'
) d ON b.Medicare_Provider_No = d.provider_id
WHERE a.year = 2014
  AND a.Total_Births > 0 -- in some cases this metric is messed up but it's what the state uses
HAVING a.C_Sect / a.Total_Births < 1