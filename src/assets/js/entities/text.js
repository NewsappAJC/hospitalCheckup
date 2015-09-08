HospitalCheckup.module("Entities", function(Entities, HospitalCheckup, Backbone, Marionette, $, _){

/* ------ INFECTIONS ----- */
  Entities.InfectionIntroTxt = {
    headline: "<h1>Healthcare-associated infections</h1>",
    intro_text: "<p>The federal government tracks infection control at hospitals nationwide, releasing new data quarterly. The Atlanta Journal-Constitution uses the data to analyze the performance of more than two dozen metro Atlanta hospitals. This information shows how often patients contract infections while getting care, when compared to similar hospitals. Public health experts say these types of infections are preventable if hospitals carefully follow protocols for infection prevention. This information is collected by the National Healthcare Safety Network at the U.S. Centers for Disease Control and Prevention.</p><p>The federal government uses a standardized infection ratio (SIR) to measure how well hospitals are doing on infection control. The SIR compares the number of infections in a hospital to a national benchmark. The information below is based on data collected from 10/1/2013 to 9/30/2014.<br><strong>Lower numbers are better. A score of zero – meaning no infections – is best.</strong></p><p>The AJC has data on these types of hospital-acquired infections – <a href='https://www.medicare.gov/hospitalcompare/about/complications.html' target='_blank'>click to find out more about these types of infections.</a></p><p>Select one of the measures below to see how metro Atlanta hospitals rate:</p>",
    bottom_text: "<h4>Standardized Infection Ratio</h4><p>Dots on the graph above indicate a hospital's standardized infection ratio, or SIR. The colored bars show the SIR's 95 percent confidence interval, which indicates the precision of the calculated SIR. Wider bars indicate less precision.</p><p>To arrive at the SIR, the government calculates the number of infections that are predicted at a given hospital and compares that to the reported number. To calculate the predicted number, the CDC uses benchmark rates from the years 2006 to 2008 for CLABSI and SSI, and from 2009 for CAUTI. Benchmark rates for hospital onset MRSA bacteremia and C. difficile are from 2010-2011. The kinds of patients a hospital serves also is a factor.</p><ul><li><strong>If SIR is 1:</strong> the number of infections reported is the same as the number of predicted infections.</li><li><strong>If SIR is less than 1:</strong> there were fewer infections reported than predicted given the baseline data.</li><li><strong>If SIR is more than 1:</strong> there were more infections reported than predicted given the baseline data.</li></ul><p>Note: The National Healthcare Safety Network, the CDC’s system that collects this data, is highly respected. But even those who run it would like to see more validation of the data to make sure hospitals are accurately reporting their figures.</p>"
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
    intro_text: "<p>Patients who undergo knee or hip replacements can experience complications ranging from infections and serious blood clots, to artificial joints that do not work and wounds that split open. Some patients can die due to complications from this elective surgery. The U.S. Centers for Medicare & Medicaid Services calculates readmission and complication rates in order to highlight those hospitals achieving the best – and worst – results. Here’s a look at how CMS rated metro Atlanta’s hospitals on joint replacements. Here’s what’s covered in this AJC quality checker:</p><p><strong>What's Included:</strong> Estimated rates for readmissions and complications. Click on the drop-down below to select a measure.</p><p><strong>Rate:</strong> The dot shows the risk-adjusted estimate of the rate (CMS adjusts the numbers based on the health of patients each hospital sees. That’s to make comparisons fair.)</p><p><strong>Range:</strong> The colored bar shows a range within which the true rate might fall. The rates are risk-adjusted estimates, after all, and CMS uses the range to indicate how precise its estimate is. The bar color indicates whether the difference from the national average, better or worse, is statistically significant.</p><p><strong>Who is included in this data:</strong> Patients covered by original Medicare</p><p><strong>Time period:</strong> Readmissions: July 1, 2011 to June 30, 2014. Complications: April 1, 2011 to March 31, 2014.</p><p>More information about this and other hospital quality measures can be found at <a href='http://www.medicare.gov/hospitalcompare/Data/RCD-Overview.html' target='_blank'>Medicare.gov.</a></p>",
    bottom_text: ""
  };

  Entities.SurgeryLabels = new Backbone.Collection([
    {label: "Complications", key: "complication"},
    {label: "Readmissions", key: "readmission"}
  ]);


/* ----- PERINATAL ----- */
  Entities.PerinatalIntroTxt = {
    headline: "<h1>Labor & Delivery</h1>",
    intro_text: "<p>If your family is getting ready to welcome a new baby into the world, you may want to know more about the hospital that will handle the delivery.</p><p>The Atlanta Journal-Constitution has analyzed public reports to provide you with some key facts, including rates for C-sections and early elective deliveries, along with the hospital’s typical fee for handling a birth.  We can also tell you how many babies a hospital delivers.</p><p>C-sections have increased significantly in recent years and experts are calling for less reliance on these procedures, which generally put a mother at risk for future C-sections. Experts also want doctors to cut back on elective early deliveries. Some early deliveries are medically necessary and others happen when a mother goes into labor early. Those can’t be avoided. But other babies are born early when doctors induce labor or deliver by C-section as a convenience to themselves or at the request of the baby’s parents.</p>",
    bottom_text: ""
  };

  Entities.PerinatalLabels = new Backbone.Collection([
    {label: "Percent of births performed by C-section", key: "C_Sect_pct"},
    {label: "Rate of early elective deliveries", key: "early_births_pct"},
    {label: "Average delivery charge", key: "Avg_Delivery_Charge"},
    {label: "Average premature delivery charge", key: "Avg_Premature_Delivery_Charge"},
    {label: "Total number of births in 2014", key: "Total_Births"}
  ]);
});