/*
Import Medicare/Medicaid ID lookup from 'Lookup - Mcaid & Mcare #' table exported as csv from 'Hospital Survey Data.mdb'
Data available at https://dch.georgia.gov/health-planning-databases
*/

DROP TABLE IF EXISTS lu_id_test;

CREATE TABLE lu_id_test (
  Facility_Name VARCHAR(255),
  UID CHAR(7),
  Medicaid_Provider_No CHAR(8),
  Medicare_Provider_No CHAR(6),
  PRIMARY KEY (UID)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

LOAD DATA LOCAL INFILE '~/data/ahq/Lookup - Mcaid & Mcare #.csv'
INTO TABLE lu_id_test
FIELDS TERMINATED BY ','
  OPTIONALLY ENCLOSED BY '"'
IGNORE 1 LINES;
