/*
Create data table for pregnency/delivery site.
State Hospital Survey Data available at https://dch.georgia.gov/health-planning-databases
(Annual Hospital Questionaire - 2000 to 2014)
*/
select b.uid, b.Medicare_Provider_No,
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
       a.Beds_Inter7mediate,
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
from ahq.perinatal a
join ahq.lu_id b using(uid)
join hospital_compare.hospital_names c
  on c.providerNumber = b.Medicare_Provider_No
left join (
  select provider_id,
         score as early_births,
         sample as medicare_births,
         footnote
  from hospital_compare.HQI_HOSP_TimelyEffectiveCare
  where measure_id = 'PC_01'
) d on b.Medicare_Provider_No = d.provider_id
where a.year = 2013
  and a.Total_Deliveries > 0
having a.C_Sect / a.Total_Births < 1