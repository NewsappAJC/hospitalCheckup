#! /usr/bin/env python

#This script takes the awkward result of a SQL statement and gives it a logical object schema so we can refer to common properties instead of having to target them directly

import json
import decimal #for rounding totals

##### HOSPITAL ASSOCIATED INFECTIONS #####
f = open( '../src/assets/data/src/HAI_transposed.json', 'rU' )
src = json.load(f)
f.close()

tree = []
ratingClasses = {"No Different than National Benchmark":"normal", "Better than the National Benchmark":"good", "Worse than the National Benchmark":"bad", "Not Available": ""}

for node in src:
    hospital = {}
    hospital["id"] = node["provider_id"]
    hospital["display_name"] = node["ajc_hospital_name"]
    hospital["address"] = node["address"]
    hospital["city"] = node["city"]
    hospital["infections"] = {
            "cauti" : {}, "clabsi" : {}, "mrsa" : {}, "ssicolon" : {}, "ssihyst" : {}, "cdiff" : {}
    }

    #loop through keys looking for the infection substrings and create objects to hold their common properties
    for key in node.keys():
        tmp = key.lower().split("_")
        inf = tmp[0]
        val = node[key]
        if inf in hospital["infections"]:
            param = tmp[1]
            hospital["infections"][inf][param] = val

            if(param == "lower" and val is None):
                hospital["infections"][inf][param] = 0

            #how are incidents being calculated?
            if(param == "days"):
                if(inf == "cauti"):
                    hospital["infections"][inf]["incidents_label"] = "Urinary catheter days"
                elif(inf == "clabsi"):
                    hospital["infections"][inf]["incidents_label"] = "Central line days"
                elif(inf == "mrsa" or inf == "cdiff"):
                    hospital["infections"][inf]["incidents_label"] = "Patient days"
                try:
                    hospital["infections"][inf]["incidents"] = "{:,d}".format(val)
                except:
                    hospital["infections"][inf]["incidents"] = "Not available" #We'll filter out NaN data points later, but this is displayed and these said "null"
                del hospital["infections"][inf][param] #just added this above but whatever
            elif(param == "procedures"):
                hospital["infections"][inf]["incidents_label"] = "Procedures"
                hospital["infections"][inf]["incidents"] = val
                del hospital["infections"][inf][param]

            if(param == "category"):
                hospital["infections"][inf]["ratingClass"] = ratingClasses[val]

    tree.append(hospital)

# ft = open( '../src/assets/data/src/infection_avgs_web.json', 'rU')
# src = json.load(ft)
# ft.close()
#
# infDict = {"HAI_1_SIR" : "clabsi", "HAI_2_SIR" : "cauti", "HAI_3_SIR" : "ssicolon", "HAI_4_SIR" : "ssihyst", "HAI_5_SIR" : "mrsa", "HAI_6_SIR" : "cdiff"}
# totals = {"id": "infectionsStateAverages"} #backbone expects an ID and local storage uses it too
#
# for node in src:
#     totals[infDict[node["measure"]]] = node["score"]

import urllib2
print "***NOTE: Using ICU only data for CLABSI and CAUTI, revisit in future***"
endpoints = [{"clabsi": "https://data.medicare.gov/resource/qfdj-8fa5.json?measure_id=HAI_1a_SIR&state=GA"}, {"cauti": "https://data.medicare.gov/resource/qfdj-8fa5.json?measure_id=HAI_2a_SIR&state=GA"}, {"ssicolon": "https://data.medicare.gov/resource/qfdj-8fa5.json?measure_id=HAI_3_SIR&state=GA"}, {"ssihyst": "https://data.medicare.gov/resource/qfdj-8fa5.json?measure_id=HAI_4_SIR&state=GA"}, {"mrsa": "https://data.medicare.gov/resource/qfdj-8fa5.json?measure_id=HAI_5_SIR&state=GA"}, {"cdiff": "https://data.medicare.gov/resource/qfdj-8fa5.json?measure_id=HAI_6_SIR&state=GA"}]

totals = {"id": "infectionsStateAverages"} #backbone expects an ID and local storage uses it too
for node in endpoints: #go through each enpoint
    for key in node.keys(): #use the key as an ID later
        url = urllib2.Request(node[key])
        data = json.load(urllib2.urlopen(url))

        for item in data:
            totals[key] = float(item["score"])


f = open( '../src/assets/data/infections.json', 'w')
f.write(json.dumps({"hospitals": tree, "averages": totals}, indent=2, sort_keys=True))
f.close()

print "hospital infections JSON saved!"


##### HIP/KNEE SURGERIES #####
#rename unintuitive ratio keys and round the averages
f = open( '../src/assets/data/src/hip_knee.json', 'rU' )
src = json.load(f)
f.close()

tree = []
ratingClasses = {"No different than the National Rate":"normal", "Better than the National Rate":"good", "Worse than the National Rate":"bad", "Number of Cases Too Small": ""}

def isNA(string):
    return int(string == "Number of Cases Too Small")

for node in src:
    hospital = {}
    hospital["id"] = node["provider_id"]
    hospital["display_name"] = node["ajc_hospital_name"]
    hospital["address"] = node["address"]
    hospital["city"] = node["city"]
    hospital["surgery"] = {
        "readmissions" : {}, "complications" : {}
    }

    #loop through keys looking for the infection substrings and create objects to hold their common properties
    for key in node.keys():
        tmp = key.lower().split("_")
        measure = tmp[0]
        if measure in hospital["surgery"]:
            param = tmp[1]

            if(param != "notes"):
                hospital["surgery"][measure][param] = node[key]
            if(param == "category"):
                hospital["surgery"][measure]["na"] = isNA(node[key])
                hospital["surgery"][measure]["ratingClass"] = ratingClasses[node[key]]

    tree.append(hospital)

##### Uses this API endpoint because I couldn't find a current national average in the database http://dev.socrata.com/foundry/#/data.medicare.gov/tiin-ktzr
#already imported urllib2 earlier
endpoints = [{"complications": "https://data.medicare.gov/resource/tiin-ktzr.json?measure_id=COMP_HIP_KNEE"}, {"readmissions": "https://data.medicare.gov/resource/vfqj-duc4.json?measure_id=READM_30_HIP_KNEE"}]

totals = {"id": "hipkneeAverages", "national": {}} #backbone expects an ID and local storage uses it too
for node in endpoints: #go through each endpoint
    for key in node.keys(): #use the key as an ID later to match it with state level
        url = urllib2.Request(node[key])
        data = json.load(urllib2.urlopen(url))
        for item in data:
            totals["national"][key] = float(item["national_rate"])

ft = open( '../src/assets/data/src/hipknee_avgs_web.json', 'rU')
src = json.load(ft)
ft.close()

#would be easy to do this in sql but I want the view to be easy to understand
hipkneeDict = {"ga_readm_avg" : "readmissions", "ga_comp_avg" : "complications"}


for node in src:
    for key in node.keys():
        totals[hipkneeDict[key]] = node[key]

f = open( '../src/assets/data/surgery.json', 'w')
f.write(json.dumps({"hospitals": tree, "averages": totals}, indent=2, sort_keys=True))
f.close()

print "hospital hipknee JSON saved!"


##### PERINATAL #####
f = open( '../src/assets/data/src/perinatal.json', 'rU' )
src = json.load(f)
f.close()

tree = []
#there's a bunch of stuff in the data not being used in the app, just grab the stuff that will be displayed
names = ["Delivery_Rms", "Birthing_Rms", "LDR_Rms", "LDRP_Rms", "C_Sect", "Live_Births", "total_births", "csect_pct", "avg_delivery_charge", "avg_premature_charge", "early_births_pct", "Beds_New_Born", "Beds_Intermediate", "Beds_Intensive"]

for node in src:
    hospital = {}
    hospital["id"] = node["provider_id"]
    hospital["display_name"] = node["ajc_hospital_name"]
    hospital["address"] = node["address"]
    hospital["city"] = node["city"]

    #loop through keys looking for the infection substrings and create objects to hold their common properties
    for key in node.keys():
        if key in names:
            val = node[key]
            hospital[key] = val

    tree.append(hospital)

#Gwinnett Medical didn't file their survey until after the data was prepared for download and they are a major player so adding them manually for now
#data from http://www.georgiahealthdata.info/CCSS/AHQPDF2014.php?uid=HOSP366
tree.append({ "Beds_Intensive": 16, "Beds_Intermediate": 8, "Beds_New_Born": 40, "Birthing_Rms": 0, "C_Sect": 1584, "Delivery_Rms": 0, "LDRP_Rms": 0, "LDR_Rms": 19, "Live_Births": 4953, "address": "1000 Medical Center Boulevard", "avg_delivery_charge": 7298, "avg_premature_charge": 37635, "city": "Lawrenceville", "csect_pct": 36, "display_name": "Gwinnett Medical Center", "early_births_pct": 3, "id": "110087", "total_births": 4989})
print "**** MANUALLY ADDED GWINNETT MEDICAL TO PERINATAL DATA -- REMOVE BEFORE UPDATING WITH 2015 DATA ****"

ft = open( '../src/assets/data/src/perinatal_avgs_web.json', 'rU')
src = json.load(ft)
ft.close()

#would be easy to do this in sql but I want the view to be easy to understand
perinatalDict = {"avgC_SectPct" : "csect_pct", "avgDeliveryCharge" : "avg_delivery_charge", "avgPrematureCharge": "avg_premature_charge", "avgBirths": "total_births", "earlyPct": "early_births_pct"}
totals = {"id": "perinatalStateAverages"} #backbone expects an ID and local storage uses it too

for node in src:
    for key in node.keys():
        totals[perinatalDict[key]] = node[key]

f = open( '../src/assets/data/perinatal.json', 'w')
f.write(json.dumps({"hospitals": tree, "averages": totals}, indent=2, sort_keys=True))
f.close()
print "hospital perinatal JSON saved!"

#####ER Waits#####
f = open( '../src/assets/data/src/ER_waits.json', 'rU' )
src = json.load(f)
f.close()

nums = ["er_inpatient_1", "er_inpatient_2", "er_total_time_avg", "er_time_to_eval", "er_time_to_painmed", "er_left_pct", "er_time_to_ctresults"]

for node in src:
    hospital = node
    for key in node.keys():
        if key in nums:
            try:
                node[key] = int(node[key])
            except:
                node[key] = node[key] #we'll check for NaN in app to filter these out, usually some string indicating not enough data

###State averages###
#er_volume (EDV) not included in state and national bc it is categorical so you can't average it
endpoints = [{"er_inpatient_1": "https://data.medicare.gov/resource/apyc-v239.json?measure_id=ED_1b&state=GA"}, {"er_inpatient_2": "https://data.medicare.gov/resource/apyc-v239.json?measure_id=ED_2b&state=GA"}, {"er_total_time_avg": "https://data.medicare.gov/resource/apyc-v239.json?measure_id=OP_18b&state=GA"}, {"er_time_to_eval": "https://data.medicare.gov/resource/apyc-v239.json?measure_id=OP_20&state=GA"}, {"er_time_to_painmed": "https://data.medicare.gov/resource/apyc-v239.json?measure_id=OP_21&state=GA"}, {"er_left_pct": "https://data.medicare.gov/resource/apyc-v239.json?measure_id=OP_22&state=GA"}, {"er_time_to_ctresults": "https://data.medicare.gov/resource/apyc-v239.json?measure_id=OP_23&state=GA"}]

totals = {"id": "erStateAverages"} #backbone expects an ID and local storage uses it too
for node in endpoints: #go through each enpoint
    for key in node.keys(): #use the key as an ID later
        url = urllib2.Request(node[key])
        data = json.load(urllib2.urlopen(url))

        for item in data:
            totals[key] = int(item["score"])

f = open( '../src/assets/data/er.json', 'w')
f.write(json.dumps({"hospitals": src, "averages": totals}, indent=2, sort_keys=True))
f.close()
print "hospital ER waits JSON saved!"