/*
Load Pregnancy and Delivery process of care measurement data from CMS.
Data available at https://data.medicare.gov/data/hospital-comparec (CSV Flatfiles - Revised).
*/

drop table if exists HQI_HOSP_TEC_PC;

create table HQI_HOSP_TEC_PC (
  Provider_Number char(6),
  Hospital_Name varchar(255),
  Address_1 varchar(255),
  Address_2 varchar(255),
  Address_3 varchar(255),
  City varchar(255),
  State varchar(255),
  ZIP_Code varchar(255),
  County_Name varchar(255),
  Phone_Number varchar(255),
  Percent_early_deliveries int,
  Number_of_Patients_1 int,
  Footnote_1 varchar(255)
) engine=InnoDB;

load data local infile '~/data/hospital-compare/Hospital_Revised_Flatfiles_20141009/Process of Care Measures - Pregnancy and Delivery Care.csv'
into table HQI_HOSP_TEC_PC
fields terminated by ','
  optionally enclosed by '"'
ignore 1 lines;
