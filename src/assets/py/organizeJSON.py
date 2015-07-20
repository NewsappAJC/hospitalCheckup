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
    hospital["infections"] = {
        "cauti" : {}, "clabsi" : {}, "ssicolon" : {}, "ssihyst" : {}, "cdiff" : {}
    }

    #loop through keys looking for the infection substrings and create objects to hold their common properties
    for key in node.keys():
        tmp = key.lower().split("_")
        if tmp[0] in hospital["infections"]:
            hospital["infections"][tmp[0]][tmp[1]] = node[key]

    tree.append(hospital)

f = open( '../data/infections.json', 'w')
f.write(json.dumps(tree, indent=2, sort_keys=True))
f.close()
print "JSON saved!"
