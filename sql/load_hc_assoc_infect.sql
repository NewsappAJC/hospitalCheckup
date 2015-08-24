/*
Load CMS health care-associated infections data.
Data available at https://data.medicare.gov/data/hospital-comparec (CSV Flatfiles - Revised).
*/

drop table if exists hc_assoc_infect;

create table hc_assoc_infect (
  Provider_ID varchar(9),
  Hospital_Name varchar(255),
  Address varchar(255),
  City varchar(255),
  State char(2),
  ZIP_Code char(5),
  County_Name varchar(125),
  Phone_Number varchar(10),
  Measure_Name varchar(255),
  Measure_ID varchar(20),
  Compared_To_National varchar(255),
  Score varchar(60),
  Footnote varchar(125),
  Measure_Start_Date date,
  Measure_End_Date date,
  PRIMARY KEY (Provider_ID, Measure_ID)
) ENGINE=INNODB

load data local infile '~/data/hospital-compare/Hospital_Revised_Flatfiles_20150716/Healthcare Associated Infections - Hospital.csv'
into table hc_assoc_infect
fields terminated by ','
  optionally enclosed by '"'
ignore 1 lines
(
  Provider_ID,
  Hospital_Name,
  Address,
  City,
  State,
  ZIP_Code,
  County_Name,
  Phone_Number,
  Measure_Name,
  Measure_ID,
  Compared_To_National,
  @Score,
  @Footnote,
  @Measure_Start_Date,
  @Measure_End_Date
)
set Score = case @Score when 'Not Available' then NULL else @Score end,
    Footnote = case @Footnote when '' then NULL else @Footnote end,
    Measure_Start_Date = STR_TO_DATE(@Measure_Start_Date,'%m/%d/%Y'),
    Measure_End_Date = STR_TO_DATE(@Measure_End_Date,'%m/%d/%Y');