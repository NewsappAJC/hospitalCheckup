/*
Import perinatal data from 'T7/ Perinatal' table exporterd to Perinatal.csv from 'Hospital Survey Data.mdb'
Data available at https://dch.georgia.gov/health-planning-databases
*/

drop table if exists perinatal;

CREATE TABLE perinatal (
  Year YEAR,
  UID CHAR(7),
  GID VARCHAR(255),
  Facility_Name VARCHAR(255),
  LOC INT,
  Delivery_Rms INT,
  Birthing_Rms INT,
  LDR_Rms INT,
  LDRP_Rms INT,
  C_Sect INT,
  Live_Births INT,
  Total_Births INT,
  Total_Deliveries INT,
  Beds_New_Born INT,
  Beds_Intermediate INT,
  Beds_Intensive INT,
  Adms_New_Born INT,
  Adms_Intermediate INT,
  Adms_Intensive INT,
  Days_New_Born INT,
  Days_Intermediate INT,
  Days_Intensive INT,
  Transfers_New_Born INT,
  Transfers_Intermediate INT,
  Transfers_Intensive INT,
  Mo_AI_AN_Adms INT,
  Mo_Asian_Adms INT,
  Mo_Black_AA_Adms INT,
  Mo_Hispanic_Adms INT,
  Mo_Pac_Is_Adms INT,
  Mo_White_Adms INT,
  Mo_Multi_Adms INT,
  Mo_AI_AN_Days INT,
  Mo_Asian_Days INT,
  Mo_Black_AA_Days INT,
  Mo_Hispanic_Days INT,
  Mo_Pac_Is_Days INT,
  Mo_White_Days INT,
  Mo_Multi_Days INT,
  AGE_0_14_Adms INT,
  AGE_15_44_Adms INT,
  AGE_45_UP_Adms INT,
  AGE_0_14_Days INT,
  AGE_15_44_Days INT,
  AGE_45_UP_Days INT,
  Avg_Delivery_Charge INT,
  Avg_Premature_Delivery_Charge INT,
  PRIMARY KEY(year, UID)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

LOAD DATA LOCAL INFILE '~/data/ahq/Perinatal.csv'
INTO TABLE perinatal
FIELDS TERMINATED BY ','
  OPTIONALLY ENCLOSED BY '"'
IGNORE 1 LINES
