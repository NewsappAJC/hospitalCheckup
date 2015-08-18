#! /usr/bin/env python

#This script takes the awkward result of a SQL statement and gives it a logical object schema so we can refer to common properties instead of having to target them directly

import json

f = open( '../data/src/hai.json', 'rU' ) 
src = json.load(f)
f.close()

tree = []
totals = { "cauti" : [0,0], "clabsi" : [0,0], "mrsa" : [0,0], "ssicolon" : [0,0], "ssihyst" : [0,0], "cdiff" : [0,0] }
doneTotals = {}

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
        inf = tmp[0]
        if inf in hospital["infections"]:
            hospital["infections"][inf][tmp[1]] = node[key]
            if tmp[1] == "ratio":
                val = float(node[key])
                if(val > 0):
                    totals[inf][0] += val
                    totals[inf][1] += 1 #keep track of how many have data so we can average
        # if tmp[0] in keys: #for array lookup
        #if tmp[0] in infections:
            #infections[tmp[0]][tmp[1]] = node[key]
        #if tmp[0] in keys: #for array lookup
            #hospital["infections"][keys.index(tmp[0])][tmp[0]][tmp[1]] = node[key]

    #we want to loop through an array of infection objects rather than k/v pairs
    #hospital["infections"] = [infections["cauti"], infections["clabsi"], infections["ssicolon"], infections["ssihyst"], infections["cdiff"], infections["mrsa"]]

    tree.append(hospital)

for key,val in totals.items():
    doneTotals[key] = val[0]/val[1]
    #print "{} = {}".format(key, val)

print doneTotals

f = open( '../data/infections.json', 'w')
f.write(json.dumps(tree, indent=2, sort_keys=True))
f.close()
print "JSON saved!"
