/*
Load CMS state-level timely effective care data for hip/knee replacement site.
Data available at https://data.medicare.gov/data/hospital-comparec (CSV Flatfiles - Revised).
*/

drop table if exists hospital_compare.HQI_STATE_TimelyEffectiveCare;

CREATE TABLE hospital_compare.HQI_STATE_TimelyEffectiveCare (
  state CHAR(2),
  condition_description VARCHAR(255),
  measure_name VARCHAR(255),
  measure_id VARCHAR(12),
  score INT,
  footnote VARCHAR(255),
  measure_start_date  DATE,
  measure_end_date DATE,
  primary key (state, measure_id)
) ENGINE = INNODB;

load data local infile '~/data/hospital-compare/Hospital_20140910/Timely and Effective Care - State.csv'
into table hospital_compare.HQI_STATE_TimelyEffectiveCare
fields terminated by ','
  optionally enclosed by '"'
lines terminated by '\r\n'
ignore 1 lines
(
  state,
  condition_description,
  measure_name,
  measure_id,
  @score,
  footnote,
  @measure_start_date,
  @measure_end_date
)
set score = case @score when 'Not Available' then NULL else @score end,
    measure_start_date = STR_TO_DATE(@measure_start_date,'%m/%d/%Y'),
    measure_end_date = STR_TO_DATE(@measure_end_date,'%m/%d/%Y');

