/*
Transpose CMS healthcare associated infections data.
*/

DROP TABLE IF EXISTS HAI_transposed;

/* Base table */
CREATE TABLE HAI_transposed
(PRIMARY KEY (provider_id))
SELECT DISTINCT a.provider_id,
                a.hospital_name,
                b.HospitalName as ajc_hospital_name,
                a.address,
                a.city,
                a.state,
                a.zip_code,
                a.county_name
FROM hc_assoc_infect a
JOIN hospital_names b ON a.provider_ID = b.ProviderNumber;

/* Catheter-Assiciated Urinary Tract Infections (CAUTI) */
ALTER TABLE HAI_transposed
  ADD COLUMN CAUTI_ratio decimal(5,3),
  ADD COLUMN CAUTI_lower decimal(5,3),
  ADD COLUMN CAUTI_observed int,
  ADD COLUMN CAUTI_predicted decimal(5,3),
  ADD COLUMN CAUTI_upper decimal(5,3),
  ADD COLUMN CAUTI_days int,
  ADD COLUMN CAUTI_category varchar(255),
  ADD COLUMN CAUTI_note varchar(255),
  ADD COLUMN CAUTI_na tinyint;

update HAI_transposed a, (
  SELECT provider_id, score,
         compared_to_national,
         footnote
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_2a_SIR' ) t
SET a.CAUTI_ratio = t.score,
    a.CAUTI_category = t.compared_to_national,
    a.CAUTI_note = t.footnote,
    a.CAUTI_na = CASE footnote WHEN '13 - Results cannot be calculated for this reporting period.' THEN 1 ELSE 0 END
WHERE a.provider_id = t.provider_id;

update HAI_transposed a, (
  SELECT provider_id, score
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_2a_CI_LOWER' ) t
SET a.CAUTI_lower = t.score
WHERE a.provider_id = t.provider_id;

update HAI_transposed a, (
  SELECT provider_id, score
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_2a_NUMERATOR' ) t
SET a.CAUTI_observed = t.score
WHERE a.provider_id = t.provider_id;

update HAI_transposed a, (
  SELECT provider_id, score
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_2a_ELIGCASES' ) t
SET a.CAUTI_predicted = t.score
WHERE a.provider_id = t.provider_id;

update HAI_transposed a, (
  SELECT provider_id, score
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_2a_CI_UPPER' ) t
SET a.CAUTI_upper = t.score
WHERE a.provider_id = t.provider_id;

update HAI_transposed a, (
  SELECT provider_id, score
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_2a_DOPC_DAYS' ) t
SET a.CAUTI_days = t.score
WHERE a.provider_id = t.provider_id;

/* Central line-associated blood stream infectoins (CLABSI) */
ALTER TABLE HAI_transposed
  ADD COLUMN CLABSI_ratio decimal(5,3),
  ADD COLUMN CLABSI_lower decimal(5,3),
  ADD COLUMN CLABSI_observed int,
  ADD COLUMN CLABSI_predicted decimal(5,3),
  ADD COLUMN CLABSI_upper decimal(5,3),
  ADD COLUMN CLABSI_days int,
  ADD COLUMN CLABSI_category varchar(255),
  ADD COLUMN CLABSI_note varchar(255),
  ADD COLUMN CLABSI_na tinyint;

update HAI_transposed a, (
  SELECT provider_id, score,
         compared_to_national,
         footnote
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_1a_SIR' ) t
SET a.CLABSI_ratio = t.score,
    a.CLABSI_category = t.compared_to_national,
    a.CLABSI_note = t.footnote,
    a.CLABSI_na = CASE footnote WHEN '13 - Results cannot be calculated for this reporting period.' THEN 1 ELSE 0 END
WHERE a.provider_id = t.provider_id;

update HAI_transposed a, (
  SELECT provider_id, score
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_1a_CI_LOWER' ) t
SET a.CLABSI_lower = t.score
WHERE a.provider_id = t.provider_id;

update HAI_transposed a, (
  SELECT provider_id, score
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_1a_NUMERATOR' ) t
SET a.CLABSI_observed = t.score
WHERE a.provider_id = t.provider_id;

update HAI_transposed a, (
  SELECT provider_id, score
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_1a_ELIGCASES' ) t
SET a.CLABSI_predicted = t.score
WHERE a.provider_id = t.provider_id;

update HAI_transposed a, (
  SELECT provider_id, score
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_1a_CI_UPPER' ) t
SET a.CLABSI_upper = t.score
WHERE a.provider_id = t.provider_id;

update HAI_transposed a, (
  SELECT provider_id, score
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_1a_DOPC_DAYS' ) t
SET a.CLABSI_days = t.score
WHERE a.provider_id = t.provider_id;

/* Methicillin-resistant Staphylococcus Aureus (MRSA) Blood Laboratory-identified Events (Bloodstream infections) */
ALTER TABLE HAI_transposed
  ADD COLUMN MRSA_ratio decimal(5,3),
  ADD COLUMN MRSA_lower decimal(5,3),
  ADD COLUMN MRSA_observed int,
  ADD COLUMN MRSA_predicted decimal(5,3),
  ADD COLUMN MRSA_upper decimal(5,3),
  ADD COLUMN MRSA_days int,
  ADD COLUMN MRSA_category varchar(255),
  ADD COLUMN MRSA_note varchar(255),
  ADD COLUMN MRSA_na tinyint;

update HAI_transposed a, (
  SELECT provider_id, score,
         compared_to_national,
         footnote
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_5_SIR' ) t
SET a.MRSA_ratio = t.score,
    a.MRSA_category = t.compared_to_national,
    a.MRSA_note = t.footnote,
    a.MRSA_na = CASE footnote WHEN '13 - Results cannot be calculated for this reporting period.' THEN 1 ELSE 0 END
WHERE a.provider_id = t.provider_id;

update HAI_transposed a, (
  SELECT provider_id, score
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_5_CI_LOWER' ) t
SET a.MRSA_lower = t.score
WHERE a.provider_id = t.provider_id;

update HAI_transposed a, (
  SELECT provider_id, score
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_5_NUMERATOR' ) t
SET a.MRSA_observed = t.score
WHERE a.provider_id = t.provider_id;

update HAI_transposed a, (
  SELECT provider_id, score
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_5_ELIGCASES' ) t
SET a.MRSA_predicted = t.score
WHERE a.provider_id = t.provider_id;

update HAI_transposed a, (
  SELECT provider_id, score
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_5_CI_UPPER' ) t
SET a.MRSA_upper = t.score
WHERE a.provider_id = t.provider_id;

update HAI_transposed a, (
  SELECT provider_id, score
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_5_DOPC_DAYS' ) t
SET a.MRSA_days = t.score
WHERE a.provider_id = t.provider_id;

/* Clostridium difficile (C.diff.) Laboratory-identified Events (Intestinal infections) */
ALTER TABLE HAI_transposed
  ADD COLUMN Cdiff_ratio decimal(5,3),
  ADD COLUMN Cdiff_lower decimal(5,3),
  ADD COLUMN Cdiff_observed int,
  ADD COLUMN Cdiff_predicted decimal(5,3),
  ADD COLUMN Cdiff_upper decimal(5,3),
  ADD COLUMN Cdiff_days int,
  ADD COLUMN Cdiff_category varchar(255),
  ADD COLUMN Cdiff_note varchar(255),
  ADD COLUMN Cdiff_na tinyint;

update HAI_transposed a, (
  SELECT provider_id, score,
         compared_to_national,
         footnote
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_6_SIR' ) t
SET a.Cdiff_ratio = t.score,
    a.Cdiff_category = t.compared_to_national,
    a.Cdiff_note = t.footnote,
    a.Cdiff_na = CASE footnote WHEN '13 - Results cannot be calculated for this reporting period.' THEN 1 ELSE 0 END
WHERE a.provider_id = t.provider_id;

update HAI_transposed a, (
  SELECT provider_id, score
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_6_CI_LOWER' ) t
SET a.Cdiff_lower = t.score
WHERE a.provider_id = t.provider_id;

update HAI_transposed a, (
  SELECT provider_id, score
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_6_NUMERATOR' ) t
SET a.Cdiff_observed = t.score
WHERE a.provider_id = t.provider_id;

update HAI_transposed a, (
  SELECT provider_id, score
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_6_ELIGCASES' ) t
SET a.Cdiff_predicted = t.score
WHERE a.provider_id = t.provider_id;

update HAI_transposed a, (
  SELECT provider_id, score
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_6_CI_UPPER' ) t
SET a.Cdiff_upper = t.score
WHERE a.provider_id = t.provider_id;

update HAI_transposed a, (
  SELECT provider_id, score
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_6_DOPC_DAYS' ) t
SET a.Cdiff_days = t.score
WHERE a.provider_id = t.provider_id;

/* Surgical Site Infection from colon surgery (SSI: Colon) */
ALTER TABLE HAI_transposed
  ADD COLUMN SSIcolon_ratio decimal(5,3),
  ADD COLUMN SSIcolon_lower decimal(5,3),
  ADD COLUMN SSIcolon_observed int,
  ADD COLUMN SSIcolon_predicted decimal(5,3),
  ADD COLUMN SSIcolon_upper decimal(5,3),
  ADD COLUMN SSIcolon_procedures int,
  ADD COLUMN SSIcolon_category varchar(255),
  ADD COLUMN SSIcolon_note varchar(255),
  ADD COLUMN SSIcolon_na tinyint;

update HAI_transposed a, (
  SELECT provider_id, score,
         compared_to_national,
         footnote
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_3_SIR' ) t
SET a.SSIcolon_ratio = t.score,
    a.SSIcolon_category = t.compared_to_national,
    a.SSIcolon_note = t.footnote,
    a.SSIcolon_na = CASE footnote WHEN '13 - Results cannot be calculated for this reporting period.' THEN 1 ELSE 0 END
WHERE a.provider_id = t.provider_id;

update HAI_transposed a, (
  SELECT provider_id, score
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_3_CI_LOWER' ) t
SET a.SSIcolon_lower = t.score
WHERE a.provider_id = t.provider_id;

update HAI_transposed a, (
  SELECT provider_id, score
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_3_NUMERATOR' ) t
SET a.SSIcolon_observed = t.score
WHERE a.provider_id = t.provider_id;

update HAI_transposed a, (
  SELECT provider_id, score
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_3_ELIGCASES' ) t
SET a.SSIcolon_predicted = t.score
WHERE a.provider_id = t.provider_id;

update HAI_transposed a, (
  SELECT provider_id, score
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_3_CI_UPPER' ) t
SET a.SSIcolon_upper = t.score
WHERE a.provider_id = t.provider_id;

update HAI_transposed a, (
  SELECT provider_id, score
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_3_DOPC_DAYS' ) t
SET a.SSIcolon_procedures = t.score
WHERE a.provider_id = t.provider_id;

/* Surgical Site Infection from abdominal hysterectomy (SSI: Hysterectomy) */
ALTER TABLE HAI_transposed
  ADD COLUMN SSIhyst_ratio decimal(5,3),
  ADD COLUMN SSIhyst_lower decimal(5,3),
  ADD COLUMN SSIhyst_observed int,
  ADD COLUMN SSIhyst_predicted decimal(5,3),
  ADD COLUMN SSIhyst_upper decimal(5,3),
  ADD COLUMN SSIhyst_procedures int,
  ADD COLUMN SSIhyst_category varchar(255),
  ADD COLUMN SSIhyst_note varchar(255),
  ADD COLUMN SSIhyst_na tinyint;

update HAI_transposed a, (
  SELECT provider_id, score,
         compared_to_national,
         footnote
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_4_SIR' ) t
SET a.SSIhyst_ratio = t.score,
    a.SSIhyst_category = t.compared_to_national,
    a.SSIhyst_note = t.footnote,
    a.SSIhyst_na = CASE footnote WHEN '13 - Results cannot be calculated for this reporting period.' THEN 1 ELSE 0 END
WHERE a.provider_id = t.provider_id;

update HAI_transposed a, (
  SELECT provider_id, score
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_4_CI_LOWER' ) t
SET a.SSIhyst_lower = t.score
WHERE a.provider_id = t.provider_id;

update HAI_transposed a, (
  SELECT provider_id, score
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_4_NUMERATOR' ) t
SET a.SSIhyst_observed = t.score
WHERE a.provider_id = t.provider_id;

update HAI_transposed a, (
  SELECT provider_id, score
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_4_ELIGCASES' ) t
SET a.SSIhyst_predicted = t.score
WHERE a.provider_id = t.provider_id;

update HAI_transposed a, (
  SELECT provider_id, score
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_4_CI_UPPER' ) t
SET a.SSIhyst_upper = t.score
WHERE a.provider_id = t.provider_id;

update HAI_transposed a, (
  SELECT provider_id, score
  FROM hc_assoc_infect
  WHERE measure_id = 'HAI_4_DOPC_DAYS' ) t
SET a.SSIhyst_procedures = t.score
WHERE a.provider_id = t.provider_id;
