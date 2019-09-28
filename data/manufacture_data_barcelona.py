import csv
import requests
import re
import IPython
import json
import sys
import traceback
import itertools
import numpy as np
import random
from scipy.spatial import distance


shift_vals = list(itertools.chain.from_iterable(
    [(i+1)*[num] for i, num in enumerate(np.arange(1.0/6, 1.0/(888.0*3.0), -1.0/(888.0*5.0)))]))

shift_vals_close = list(itertools.chain.from_iterable(
    [(i+1)*[num] for i, num in enumerate(np.arange(1.0/222, 1.0/(888.0*3.0), -1.0/(888.0*5.0)))]))
pos_or_neg = [-1, 1]


emoji_list = set()
names_list = set()
category_list = set()
pois = list()


def shuffle_coords(lat, long):
    lat = (random.choice(pos_or_neg) * random.choice(shift_vals)) + lat
    long = (random.choice(pos_or_neg) * random.choice(shift_vals)) + long
    return lat, long


def shuffle_coords_close(lat, long):
    lat = (random.choice(pos_or_neg) * random.choice(shift_vals_close)) + lat
    long = (random.choice(pos_or_neg) * random.choice(shift_vals_close)) + long
    return lat, long


def collect_emojis(j):
    if j == [] or j == None:
        return None
    j["lat"], j["long"] = float(j["lat"]), float(j["long"])
    emoji_list.update(j['emojis'].split('|'))
    names_list.add(j['name'])
    category_list.add(j['category'])
    pois.append(j)


def preprocess_file(filename):
    with open(filename) as b_reviews:
        for b_reviewj in b_reviews:
            b_review = json.loads(b_reviewj)
            if isinstance(b_review, list):
                for i in b_review:
                    if i:
                        collect_emojis(i)
            else:
                collect_emojis(b_review)


preprocess_file("barcelona-attraction.json")
preprocess_file("barcelona-accommodation.json")
preprocess_file("barcelona-poi.json")
preprocess_file("barcelona-restaurant.json")

cities = []
cities_pos = []

with open("cities.csv") as csvfile:
    r = csv.DictReader(csvfile)
    for row in r:
        try:
            city = {'name': row['Name'], 'lat': float(row['Latitude']) + float(
                row['Longitude'].split(' ')[0]), 'long': float(row['City']) + float(row['lat1'].split(' ')[0]),
                'limit': 0
            }
            cities.append(city)
            cities_pos.append(np.array((city['lat'], city['long'])))
            cities_limits.append(0)
        except Exception:
            pass


def write_agg_emoji(outfile, city, poi):
    emojis = []
    while len(emojis) < 1:
        emojis = '|'.join([random.choice(list(emoji_list))
                           for i in range(1, random.randint(1, 4))])
    data = json.dumps({
        'name': poi['name'],
        'city': city['name'],
        'lat': city['lat'],
        'long': city['long'],
        'category': poi['category'],
        'emojis': emojis
    })
    outfile.write(data + '\n')


def write_zoom_emoji(outfile, city, poi, lat, long):
    emojis = []
    while len(emojis) < 1:
        emojis = '|'.join([random.choice(list(emoji_list))
                           for i in range(1, random.randint(1, 4))])
    data = json.dumps({
        'name': poi['name'],
        'city': city['name'],
        'lat': lat,
        'long': long,
        'category': poi['category'],
        'emojis': emojis
    })
    outfile.write(data + '\n')


with open(sys.argv[1], 'w+') as aggregate_data:
    with open(sys.argv[2], 'w+') as barcelona_data:
        with open("tweet_pos.json") as tweet_cords:
            # 9 is Barcelona
            for tweet_cord in tweet_cords:
                corods = json.loads(tweet_cord)
                lat, long = corods["coordinates"]
                city_idx = distance.cdist(
                    np.array([(lat, long)]), cities_pos).argmin()
                city = cities[city_idx]
                if city['limit'] >= 100:
                    continue
                write_agg_emoji(aggregate_data, city, random.choice(list(pois)))
                city['limit'] = city['limit'] + 1
                cities[city_idx] = city
        for poi in list(pois):
            lat, long = shuffle_coords_close(poi['lat'], poi['long'])
            write_zoom_emoji(barcelona_data, cities[9], poi, lat, long)
