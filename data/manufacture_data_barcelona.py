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


agg_emoji_list = ['😀', '😁', '😘', '😙', '😚', '😛', '😜', '🙂', '🙃', '🙄', '🤙', '🤞', '🤟', '🤠', '✋', '✌️', '💏',
                  '💑', '👋🏻', '👋🏼', '👋🏽', '👋🏾', '👋🏿', '👌🏻', '👌🏼', '👌🏽', '👌🏾', '👌🏿', '👍🏻', '👍🏼', '👍🏽', '👍🏾', '👍🏿', '❤️', '🌶️']


def dms2dd(degrees, minutes, seconds, direction):
    dd = float(degrees) + float(minutes)/60 + float(seconds)/(60*60)
    if direction == 'S' or direction == 'W':
        dd *= -1
    return dd


def dd2dms(deg):
    d = int(deg)
    md = abs(deg - d) * 60
    m = int(md)
    sd = (md - m) * 60
    return [d, m, sd]


def parse_dms(dms):
    parts = re.split('[^\d\w]+', dms)
    lat = dms2dd(parts[0], parts[1], parts[2], parts[3])
    lng = dms2dd(parts[4], parts[5], parts[6], parts[7])

    return (lat, lng)


shift_vals = list(itertools.chain.from_iterable(
    [(i+1)*[num] for i, num in enumerate(np.arange(1.0/6, 1.0/(888.0*3.0), -1.0/(888.0*5.0)))]))

shift_vals_close = list(itertools.chain.from_iterable(
    [(i+1)*[num] for i, num in enumerate(np.arange(1.0/222, 1.0/(888.0*3.0), -1.0/(888.0*5.0)))]))
pos_or_neg = [-1, 1]


emoji_list = set()
names_list = set()
category_list = set()
pois = list()


def reject_emoji(emojis):
    return '|'.join(list(filter(lambda x: x not in ['🔪'], emojis)))


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
agg_emoji_list = list(itertools.chain.from_iterable(
    [100 * [emoji] for emoji in agg_emoji_list])) + list(emoji_list)


with open("cities.csv") as csvfile:
    r = csv.DictReader(csvfile)
    for row in r:
        try:
            latd = int(row['Latitude'])
            latm = row['Longitude'].split(' ')[0]
            lats = 0
            latc = row['Longitude'].split(' ')[1]
            longd = int(row['City'])
            longm = row['lat1'].split(' ')[0]
            longs = 0
            longc = row['lat1'].split(' ')[1]
            lat, long = parse_dms(
                f"{latd}°{latm}'{lats}' {latc} {longd}°{longm}'{longs}' {longc}")

            city = {'name': row['Name'], 'lat': lat, 'long': long,
                    'limit': 0,
                    }
            cities.append(city)
            cities_pos.append(np.array((city['lat'], city['long'])))
            cities_limits.append(0)
        except Exception:
            pass


def write_agg_emoji(outfile, city, poi):
    emojis = []
    while len(emojis) < 1:
        emojis = [random.choice(list(agg_emoji_list))
                  for i in range(1, random.randint(1, 4))]
    data = json.dumps({
        'name': poi['name'],
        'city': city['name'].split(', ')[0],
        'lat': city['lat'],
        'long': city['long'],
        'category': poi['category'],
        'emojis': reject_emoji(emojis)
    })
    outfile.write(data + '\n')


def write_zoom_emoji(outfile, city, poi, lat, long):
    data = json.dumps({
        'name': poi['name'],
        'city': city['name'].split(', ')[0],
        'lat': lat,
        'long': long,
        'category': poi['category'],
        'emojis': reject_emoji(list(set(poi['emojis'])))
    })
    outfile.write(data + '\n')


with open(sys.argv[1], 'w+') as aggregate_data:
    with open(sys.argv[2], 'w+') as barcelona_data:
        for x in range(0, 100):
            for city_idx, city in enumerate(cities):
                city = cities[city_idx]
                if city['limit'] >= 100:
                    continue
                write_agg_emoji(aggregate_data, city, random.choice(list(pois)))
                city['limit'] = city['limit'] + 1
                cities[city_idx] = city
        # with open("tweet_pos.json") as tweet_cords:
        #     # 9 is Barcelona
        #     for tweet_cord in tweet_cords:
        #         corods = json.loads(tweet_cord)
        #         lat, long = corods["coordinates"]
        #         city_idx = distance.cdist(
        #             np.array([(lat, long)]), cities_pos).argmin()
        #         city = cities[city_idx]
        #         if city['limit'] >= 100:
        #             continue
        #         write_agg_emoji(aggregate_data, city, random.choice(list(pois)))
        #         city['limit'] = city['limit'] + 1
        #         cities[city_idx] = city
        for poi in list(pois):
            lat, long = shuffle_coords_close(poi['lat'], poi['long'])
            write_zoom_emoji(barcelona_data, cities[9], poi, lat, long)
