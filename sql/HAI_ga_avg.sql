/*
  Find state average in the state table. Creates hospital_totals_web view to be digested by python infections parser script. The date on the end of the filename will need to be changed when new data arrives
*/
ALTER VIEW hospital_totals_web AS
SELECT state,measure,score FROM hai_state_20140523
WHERE state = "GA" AND measure LIKE "HAI_%_SIR"