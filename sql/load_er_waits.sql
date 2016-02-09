DROP TABLE IF EXISTS ER_waits;


CREATE TABLE ER_waits
(PRIMARY KEY (provider_id))
SELECT DISTINCT a.provider_id,
                a.hospital_name,
                b.HospitalName AS ajc_hospital_name,
                a.address,
                a.city,
                a.state,
                a.zip_code,
                a.county_name,
                a.condition_name,
                a.measure_id,
                a.measure_name,
                a.score,
                a.sample
FROM hospital_compare.HQI_HOSP_TimelyEffectiveCare a
JOIN hospital_names b ON a.provider_ID = b.ProviderNumber
WHERE condition_name = "Emergency Department"
  AND STATE = "GA";


ALTER TABLE ER_waits ADD INCREMENT MEDIUMINT NOT NULL AUTO_INCREMENT KEY;


ALTER TABLE ER_waits ADD COLUMN EDV varchar(255),
  ADD COLUMN ED_1b varchar(10),
  ADD COLUMN ED_2b varchar(10),
  ADD COLUMN OP_18b varchar(10),
  ADD COLUMN OP_20 varchar(10),
  ADD COLUMN OP_21 varchar(10),
  ADD COLUMN OP_22 varchar(10),
  ADD COLUMN OP_23 varchar(10);
