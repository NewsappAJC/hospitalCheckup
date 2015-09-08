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
                hospital["infections"][inf]["incidents"] = "{:,d}".format(val)
                del hospital["infections"][inf][param] #just added this above but whatever
            elif(param == "procedures"):
                hospital["infections"][inf]["incidents_label"] = "Procedures"
                hospital["infections"][inf]["incidents"] = val
                del hospital["infections"][inf][param]

            if(param == "category"):
                hospital["infections"][inf]["ratingClass"] = ratingClasses[val]

    tree.append(hospital)


##### HIP/KNEE SURGERIES #####
#rename unintuitive ratio keys and round the averages
ft = open( '../src/assets/data/src/infection_avgs_web.json', 'rU')
src = json.load(ft)
ft.close()

infDict = {"HAI_1_SIR" : "clabsi", "HAI_2_SIR" : "cauti", "HAI_3_SIR" : "ssicolon", "HAI_4_SIR" : "ssihyst", "HAI_5_SIR" : "mrsa", "HAI_6_SIR" : "cdiff"}
totals = {"id": "infectionsStateAverages"} #backbone expects an ID and local storage uses it too

for node in src:
    totals[infDict[node["measure"]]] = node["score"]

f = open( '../src/assets/data/infections.json', 'w')
f.write(json.dumps({"hospitals": tree, "averages": totals}, indent=2, sort_keys=True))
f.close()

print "hospital infections JSON saved!"

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
    hospital["surgery"] = {
        "readmission" : {}, "complication" : {}
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

ft = open( '../src/assets/data/src/hipknee_avgs_web.json', 'rU')
src = json.load(ft)
ft.close()

#would be easy to do this in sql but I was the view to be easy to understand
hipkneeDict = {"ga_readm_avg" : "readmission", "ga_comp_avg" : "complication"}
totals = {"id": "hipkneeStateAverages"} #backbone expects an ID and local storage uses it too

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
names = ["Delivery_Rms", "Birthing_Rms", "LDR_Rms", "LDRP_Rms", "C_Sect", "Live_Births", "Total_Births", "C_Sect_pct", "Avg_Delivery_Charge", "Avg_Premature_Delivery_Charge", "early_births_pct"]

for node in src:
    hospital = {}
    hospital["id"] = node["provider_id"]
    hospital["display_name"] = node["ajc_hospital_name"]
    hospital["address"] = node["address"]
    #hospital["address"] = node["address"] TODO get the addresses into the data

    #loop through keys looking for the infection substrings and create objects to hold their common properties
    for key in node.keys():
        if key in names:
            val = node[key]
            if(key == "C_Sect_pct" or key == "early_births_pct"):
                val = str(val)+"%"
            elif(val):
                val = "{:,d}".format(val)
                if(key == "Avg_Delivery_Charge" or key == "Avg_Premature_Delivery_Charge"):
                    val = "$"+str(val)

            hospital[key] = val

    tree.append(hospital)

ft = open( '../src/assets/data/src/perinatal_avgs_web.json', 'rU')
src = json.load(ft)
ft.close()

#would be easy to do this in sql but I was the view to be easy to understand
hipkneeDict = {"avgC_SectPct" : "C_Sect_Pct", "avgDeliveryCharge" : "Avg_Delivery_Charge", "avgPrematureCharge": "Avg_Premature_Charge", "avgBirths": "Total_Births", "avgEarlyPct": "early_births_pct"}
totals = {"id": "perinatalStateAverages"} #backbone expects an ID and local storage uses it too

for node in src:
    for key in node.keys():
        totals[hipkneeDict[key]] = node[key]

f = open( '../src/assets/data/perinatal.json', 'w')
f.write(json.dumps({"hospitals": tree, "averages": totals}, indent=2, sort_keys=True))
f.close()

print "hospital perinatal JSON saved!"
