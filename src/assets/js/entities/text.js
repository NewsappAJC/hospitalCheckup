HospitalCheckup.module("Entities", function(Entities, HospitalCheckup, Backbone, Marionette, $, _){

/* ------ INFECTIONS ----- */
  Entities.InfectionIntroTxt = {
    headline: "<h1>Healthcare-associated infections</h1>",
    intro_text: "<p>The federal government tracks infection control at hospitals nationwide, releasing new data quarterly. This information shows how often patients contract infections while getting care, when compared to similar hospitals. Public health experts say these types of infections are preventable if hospitals carefully follow protocols for infection prevention. This information is collected by the National Healthcare Safety Network at the U.S. Centers for Disease Control and Prevention.</p><p><strong>SIR:</strong> The federal government uses a standardized infection ratio (SIR) to measure how well hospitals are doing on infection control for <a href='https://www.medicare.gov/hospitalcompare/about/complications.html' target='_blank'>different types of infections</a> patients often contract while getting healthcare. The SIR compares the number of infections in a hospital to a <a href='#benchmark'>national benchmark</a>. <strong>Lower numbers are better. A score of zero – meaning no infections – is best.</strong></p><p><strong>Range:</strong> The colored bar shows a range within which the true rate might fall. The rates are risk-adjusted estimates, after all, and CMS uses the range to indicate how precise its estimate is. The color code indicates how the score compares to the national benchmark. If the entire range is above or below the national benchmark, then CMS scores the hospital as better or worse than the benchmark.</p><p><strong>Who is included in this data:</strong> All patients treated in the hospital, including adult, pediatric, neonatal, Medicare and non-Medicare.</p><p><strong>Time period:</strong> 4/1/2014 to 3/31/2015.</p>",
    bottom_text: "<h4 id='benchmark'>Standardized Infection Ratio</h4><p>Dots on the graph above indicate a hospital's standardized infection ratio, or SIR. The colored bars show the SIR's 95 percent confidence interval, which indicates the precision of the calculated SIR. Wider bars indicate less precision.</p><p>To arrive at the SIR, the government calculates the number of infections that are predicted at a given hospital and compares that to the reported number. To calculate the predicted number, the CDC uses benchmark rates from the years 2006 to 2008 for CLABSI and SSI, and from 2009 for CAUTI. Benchmark rates for hospital onset MRSA bacteremia and C. difficile are from 2010-2011. The kinds of patients a hospital serves also is a factor.</p><ul><li><strong>If SIR is 1:</strong> the number of infections reported is the same as the number of predicted infections.</li><li><strong>If SIR is less than 1:</strong> there were fewer infections reported than predicted given the baseline data.</li><li><strong>If SIR is more than 1:</strong> there were more infections reported than predicted given the baseline data.</li></ul><p>Note: The National Healthcare Safety Network, the CDC’s system that collects this data, is highly respected. But even those who run it would like to see more validation of the data to make sure hospitals are accurately reporting their figures.</p>"
  };

  Entities.InfectionLabels = new Backbone.Collection([
    {label: "Clostridium difficile (C.diff)", key: "cdiff"},
    {label: "Methicillin-resistant staphylococcus sureus (MRSA)", key: "mrsa"},
    {label: "Catheter-associated urinary tract infections", key: "cauti"},
    {label: "Central line-associated blood stream infections", key: "clabsi"},
    {label: "Surgical site infection from colon surgery", key: "ssicolon"},
    {label: "Surgical site infection from abdominal hysterectomy", key: "ssihyst"}
  ]);


/* ----- SURGERIES -----*/
  Entities.SurgeryIntroTxt = {
    headline: "<h1>Hip/knee surgery</h1>",
    intro_text: "<p>Patients who undergo knee or hip replacements can experience complications ranging from infections and serious blood clots, to artificial joints that do not work and wounds that split open. Some patients can die due to complications from this elective surgery. The U.S. Centers for Medicare & Medicaid Services calculates readmission and complication rates in order to highlight those hospitals achieving the best – and worst – results. Here’s a look at how CMS rated metro Atlanta’s hospitals on joint replacements.</p><p><strong>What's Included:</strong> Estimated rates for readmissions and complications. Click on the drop-down below to select a measure.</p><p><strong>Rate:</strong> The dot shows the risk-adjusted estimate of the rate (CMS adjusts the numbers based on the health of patients each hospital sees. That’s to make comparisons fair.)</p><p><strong>Range:</strong> The colored bar shows a range within which the true rate might fall. The rates are risk-adjusted estimates, after all, and CMS uses the range to indicate how precise its estimate is. The bar color indicates whether the difference from the national average, better or worse, is statistically significant.</p><p><strong>Who is included in this data:</strong> Patients covered by original Medicare</p><p><strong>Time period:</strong> Readmissions: July 1, 2011 to June 30, 2014. Complications: April 1, 2011 to March 31, 2014.</p><p>More information about this and other hospital quality measures can be found at <a href='http://www.medicare.gov/hospitalcompare/Data/RCD-Overview.html' target='_blank'>Medicare.gov.</a></p>",
    bottom_text: ""
  };

  Entities.SurgeryLabels = new Backbone.Collection([
    {label: "Complications", key: "complications"},
    {label: "Readmissions", key: "readmissions"}
  ]);


/* ----- PERINATAL ----- */
  Entities.PerinatalIntroTxt = {
    headline: "<h1>Labor & Delivery</h1>",
    intro_text: "<p>If your family is getting ready to welcome a new baby into the world, you may want to know more about the hospital that will handle the delivery. The Atlanta Journal-Constitution has analyzed Georgia Annual Hospital Questionnaire data to provide you with some key facts.</p><p><strong>What’s included:</strong> Rates for C-sections and early elective deliveries, along with the hospital’s typical fee for handling a birth. We can also tell you how many babies a hospital delivers. Click on the drop-down below to select a measure.</p><p><strong>Why it matters:</strong> C-sections have increased significantly in recent years and experts are calling for less reliance on these procedures, which generally put a mother at risk for future C-sections. Experts also want doctors to cut back on elective early deliveries. Some early deliveries are medically necessary and others happen when a mother goes into labor early. Those can’t be avoided. But other babies are born early when doctors induce labor or deliver by C-section as a convenience to themselves or at the request of the baby’s parents.</p><p><strong>Time period:</strong> Early elective deliveries 4/1/2014 to 3/31/2015. Other measures are 1/1/2014 to 12/31/2014.</p>",
    bottom_text: ""
  };

  Entities.PerinatalLabels = new Backbone.Collection([
    {label: "Percent of births performed by C-section", key: "csect_pct"},
    {label: "Rate of early elective deliveries", key: "early_births_pct"},
    {label: "Average delivery charge", key: "avg_delivery_charge"},
    {label: "Average premature delivery charge", key: "avg_premature_charge"},
    {label: "Total number of births in 2014", key: "total_births"}
  ]);

/* ----- ER ----- */
  Entities.ERIntroTxt = {
    headline: "<h1>ER wait times</h1>",
    intro_text: "<p>intro text</p>",
    bottom_text: ""
  };

  Entities.ERLabels = new Backbone.Collection([
    {label: "Door to diagnostic eval", key: "er_time_to_eval"},
    {label: "Total time in ER", key: "er_total_time_avg"},
    {label: "Time spent in ER before being admitted", key: "er_inpatient_1"},
    {label: "Time after doctor decided to admit patient before leaving ER for room", key: "er_inpatient_2"},
    {label: "Median time to pain med", key: "er_time_to_painmed"},
    {label: "Left before being seen", key: "er_left_pct"},
    {label: "Head CT results", key: "er_ctresults_pct"}
  ]);
});