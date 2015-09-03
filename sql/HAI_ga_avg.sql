/*
  Find state average in the state table. Creates hospital_totals_web view to be digested by python infections parser script. The date on the end of the filename will need to be changed when new data arrives
*/

/*INFECTIONS STATE AVERAGES*/
ALTER VIEW hospital_totals_web AS
SELECT state,
       measure,
       score
FROM hai_state_20140523
WHERE state = "GA" AND measure LIKE "HAI_%_SIR"


/*PERINATAL STATE AVERAGES*/
ALTER VIEW perinatal_state_avgs_web AS
SELECT round(AVG(C_Sect / Total_Deliveries)*100,0) as avgC_SectPct, /*Use Total_Deliveries or Total_Births?*/
       SUM(Avg_Delivery_Charge*Total_Deliveries)/SUM(Total_Deliveries) as avgDeliveryCharge,
       SUM(Avg_Premature_Delivery_Charge*Total_Deliveries)/SUM(Total_Deliveries) as avgPrematureCharge,
       AVG(Total_Deliveries) as avgDeliveries,
       /*'sample' might actually be the sample the score is based on? In that case should probably weight average based on that instead of Total_Deliveries, especially since the sample is 0 in many cases*/
       SUM(c.score * Total_Deliveries)/SUM(Total_Deliveries) as avgEarlyPct
FROM ahq.perinatal a
JOIN ahq.lu_id b using(uid)
LEFT JOIN hospital_compare.HQI_HOSP_TimelyEffectiveCare c
  ON b.Medicare_Provider_No = c.provider_id
WHERE Year = 2014 AND Total_Deliveries > 0 AND (C_Sect / Total_Deliveries) < 1 AND measure_id = "PC_01" AND state = "GA"