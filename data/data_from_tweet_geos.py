import itertools
import csv
import requests
import re
import IPython
import json
import sys
import traceback
import emoji
import numpy as np
import random

# filter emojis
# fix city fields (closest to center)
# zoom into barcelona

shift_vals = list(itertools.chain.from_iterable(
    [(i+1)*[num] for i, num in enumerate(np.arange(1.0/6.0, 1.0/(888.0*3.0), -1.0/(888.0*5.0)))]))

pois = []
all_emojis = list(emoji.UNICODE_EMOJI.keys())
pos_or_neg = [-1, 1]


def write_emoji(outfile, poi, lat, long):
    emojis = []
    while len(emojis) < 1:
        emojis = '|'.join([random.choice(all_emojis)
                           for i in range(1, random.randint(1, 4))])
    data = json.dumps({
        'name': poi['category'],
        'city': poi['lng'],
        'lat': lat,
        'long': long,
        'category': poi['lat'],
        'emojis': emojis
    })
    outfile.write(data + '\n')


def shuffle_coords(lat, long):
    lat = (random.choice(pos_or_neg) * random.choice(shift_vals)) + lat
    long = (random.choice(pos_or_neg) * random.choice(shift_vals)) + long
    return lat, long


with open("all_header.csv") as csvfile:
    r = csv.DictReader(csvfile)
    for row in r:
        pois.append(row)

with open(sys.argv[1], 'w+') as outfile:
    with open("tweet_pos.json") as tweet_cords:
        for tweet_cord in tweet_cords:
            corods = json.loads(tweet_cord)
            lat, long = corods["coordinates"]
            write_emoji(outfile, random.choice(pois), lat, long)
            # for times in range(1, random.randint(1, 25)):
            #     lat, long = corods["coordinates"]
            #     lat, long = shuffle_coords(lat, long)
            #     write_emoji(outfile, random.choice(pois), lat, long)
