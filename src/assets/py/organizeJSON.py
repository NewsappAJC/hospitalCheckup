#! /usr/bin/env python

#This script takes the awkward result of a SQL statement and gives it a logical object schema so we can refer to common properties instead of having to target them directly

import json
import decimal #for rounding totals

f = open( '../data/src/hai.json', 'rU' )
src = json.load(f)
f.close()

tree = []

for node in src:
    hospital = {}
    hospital["id"] = node["provider_id"]
    hospital["provider_name"] = node["hospital_name"]
    hospital["display_name"] = node["ajc_hospital_name"]
    hospital["address"] = {
        "street" : node["address_1"],
        "city" : node["city"],
        "state" : node["state"],
        "zip" : node["zip_code"],
        "county" : node["county_name"]
    }
    hospital["infections"] = {
            "cauti" : {}, "clabsi" : {}, "mrsa" : {}, "ssicolon" : {}, "ssihyst" : {}, "cdiff" : {}
    }

    #loop through keys looking for the infection substrings and create objects to hold their common properties
    for key in node.keys():
        tmp = key.lower().split("_")
        if tmp[0] in hospital["infections"]:
            hospital["infections"][tmp[0]][tmp[1]] = node[key]
        # if tmp[0] in keys: #for array lookup
        #if tmp[0] in infections:
            #infections[tmp[0]][tmp[1]] = node[key]
        #if tmp[0] in keys: #for array lookup
            #hospital["infections"][keys.index(tmp[0])][tmp[0]][tmp[1]] = node[key]

    #we want to loop through an array of infection objects rather than k/v pairs
    #hospital["infections"] = [infections["cauti"], infections["clabsi"], infections["ssicolon"], infections["ssihyst"], infections["cdiff"], infections["mrsa"]]

    tree.append(hospital)

f = open( '../data/infections.json', 'w')
f.write(json.dumps(tree, indent=2, sort_keys=True))
f.close()
print "hospital infections JSON saved!"


#rename unintuitive ratio keys and round the averages
ft = open( '../data/src/hospital_totals_web.json', 'rU')
src = json.load(ft)
ft.close()

infDict = {"HAI_1_SIR" : "clabsi", "HAI_2_SIR" : "cauti", "HAI_3_SIR" : "ssicolon", "HAI_4_SIR" : "ssihyst", "HAI_5_SIR" : "mrsa", "HAI_6_SIR" : "cdiff"}
totals = {}

def rounded(n):
    return round(decimal.Decimal(n), 3)

for node in src:
    totals[infDict[node["measure"]]] = rounded(node["AVG(score)"])

ft = open( '../data/infection_stateAvg.json', 'w')
ft.write(json.dumps(totals, indent=2, sort_keys=True))
ft.close()
print "infection state avg JSON saved!"