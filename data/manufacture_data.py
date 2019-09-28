import csv
import requests
import re
import IPython
import json
import sys
import traceback


barcelona_center = [41.23, 2.9]


def recenter(j, new_c):
    if j == [] or j == None:
        return None
    old = j
    try:
        j["lat"], j["long"] = barcelona_center[0] - \
            float(j["lat"]), barcelona_center[1] - float(j["long"])
        j["lat"], j["long"] = j["lat"] + (float(new_c["Latitude"]) + float(new_c["Longitude"].split(' ')[0]
                                                                           )), j["long"] + (float(new_c["City"]) + float(new_c["lat1"].split(' ')[0]))
        j["city"] = new_c["Name"].split(", ")[0]
    except TypeError as e:
        raise SystemExit
    return json.dumps(j)


with open(sys.argv[1], 'w+') as outfile:
    with open("cities.csv") as csvfile:
        r = csv.DictReader(csvfile)
        for row in r:
            if row['Name'] == "Barcelona, Spain" or row['Name'] == '':
                continue
            with open("barcelona-attraction.json") as b_reviews:
                for b_reviewj in b_reviews:
                    b_review = json.loads(b_reviewj)
                    if isinstance(b_review, list):
                        for i in b_review:
                            if i:
                                output = recenter(i, row)
                                if output:
                                    outfile.write(output + "\n")
                    else:
                        output = recenter(b_review, row)
                        if output:
                            outfile.write(output + "\n")
            with open("barcelona-accommodation.json") as b_reviews:
                for b_reviewj in b_reviews:
                    b_review = json.loads(b_reviewj)
                    if isinstance(b_review, list):
                        for i in b_review:
                            if i:
                                output = recenter(i, row)
                                if output:
                                    outfile.write(output + "\n")
                    else:
                        output = recenter(b_review, row)
                        if output:
                            outfile.write(output + "\n")
            with open("barcelona-poi.json") as b_reviews:
                for b_reviewj in b_reviews:
                    b_review = json.loads(b_reviewj)
                    if isinstance(b_review, list):
                        for i in b_review:
                            if i:
                                output = recenter(i, row)
                                if output:
                                    outfile.write(output + "\n")
                    else:
                        output = recenter(b_review, row)
                        if output:
                            outfile.write(output + "\n")
            with open("barcelona-restaurant.json") as b_reviews:
                for b_reviewj in b_reviews:
                    b_review = json.loads(b_reviewj)
                    if isinstance(b_review, list):
                        for i in b_review:
                            if i:
                                output = recenter(i, row)
                                if output:
                                    outfile.write(output + "\n")
                    else:
                        output = recenter(b_review, row)
                        if output:
                            outfile.write(output + "\n")
