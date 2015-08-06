#! /usr/bin/env python

#This script takes the awkward result of a SQL statement and gives it a logical object schema so we can refer to common properties instead of having to target them directly

import json

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
    infections = {
        "cauti" : {"infection" : "cauti"}, "clabsi" : {"infection" : "clabsi"}, "mrsa": { "infection" : "mrsa"}, "ssicolon" : {"infection" : "ssicolon"}, "ssihyst" : {"infection" : "ssihyst"}, "cdiff" : {"infection" : "cdiff"}
    }

    #loop through keys looking for the infection substrings and create objects to hold their common properties
    for key in node.keys():
        tmp = key.lower().split("_")
        if tmp[0] in infections:
            infections[tmp[0]][tmp[1]] = node[key]
        #if tmp[0] in keys: #for array lookup
            #hospital["infections"][keys.index(tmp[0])][tmp[0]][tmp[1]] = node[key]

    #we want to loop through an array of infection objects rather than k/v pairs
    hospital["infections"] = [infections["cauti"], infections["clabsi"], infections["ssicolon"], infections["ssihyst"], infections["cdiff"], infections["mrsa"]]
    tree.append(hospital)

f = open( '../data/infections.json', 'w')
f.write(json.dumps(tree, indent=2, sort_keys=True))
f.close()
print "JSON saved!"
