/*
Load CMS hospital-level timely effective care data for hip/knee replacement site.
Data available at https://data.medicare.gov/data/hospital-comparec (CSV Flatfiles - Revised).
*/

DROP TABLE IF EXISTS hospital_compare.HQI_HOSP_TimelyEffectiveCare;

CREATE TABLE hospital_compare.HQI_HOSP_TimelyEffectiveCare (
  provider_id CHAR(6),
  hospital_name VARCHAR(255),
  address VARCHAR(255),
  city VARCHAR(255),
  state CHAR(2),
  zip_code CHAR(5),
  county_name VARCHAR(255),
  phone_number CHAR(10),
  condition_name VARCHAR(255),
  measure_id VARCHAR(12),
  measure_name VARCHAR(255),
  score INT,
  sample INT,
  footnote VARCHAR(255),
  measure_start_date DATE,
  measure_end_date DATE,
  PRIMARY KEY (provider_id, measure_id)
) ENGINE=INNODB;

LOAD DATA LOCAL INFILE '~/data/hospital-compare/Hospital_20140910/Timely and Effective Care - Hospital.csv'
INTO TABLE hospital_compare.HQI_HOSP_TimelyEffectiveCare
FIELDS TERMINATED BY ','
  OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 LINES
(
  provider_id,
  hospital_name,
  address,
  city,
  state,
  zip_code,
  county_name,
  phone_number,
  condition_name,
  measure_id,
  measure_name,
  score,
  sample,
  footnote,
  @measure_start_date,
  @measure_end_date
)
SET measure_start_date = STR_TO_DATE(@measure_start_date, '%m/%d/%Y'),
    measure_end_date = STR_TO_DATE(@measure_end_date, '%m/%d/%Y');

UPDATE hospital_compare.HQI_HOSP_TimelyEffectiveCare
SET footnote = NULL
WHERE footnote = '';


