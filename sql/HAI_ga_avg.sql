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
SELECT round(AVG(C_Sect / Total_Deliveries)*100,0) as avgC_SectPct, #John had this as Total_Births but sometimes that is lower than C_Sect?
       AVG(Avg_Delivery_Charge),
       AVG(Avg_Premature_Delivery_Charge),
       AVG(Total_Deliveries),
       AVG(score) as early_births,
       AVG(sample) as medicare_births
FROM ahq.perinatal, hospital_compare.HQI_HOSP_TimelyEffectiveCare
WHERE Year = 2014 AND Total_Deliveries > 0 AND (C_Sect / Total_Deliveries) < 1 AND state = "GA" AND measure_id = 'PC_01'