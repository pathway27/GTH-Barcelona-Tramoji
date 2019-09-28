import csv
import requests
import re
import IPython
from lxml import html
import json
from time import sleep
import sys
from googletrans import Translator
from multiprocessing import Pool
import traceback


emoji_pattern = re.compile("["
                           u"\U0001F600-\U0001F64F"  # emoticons
                           u"\U0001F300-\U0001F5FF"  # symbols & pictographs
                           u"\U0001F680-\U0001F6FF"  # transport & map symbols
                           u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
                           "]+", flags=re.UNICODE)


def convert_review(work_data):
    row = work_data[0]
    review = work_data[1]
    try:
        text = review['text']
        if text == None or text == '':
            return None
        if review['language'] != 'en':
            translator = Translator()
            try:
                text = translator.translate(text).text
            except json.decoder.JSONDecodeError:
                return None
        review_r = requests.post(
            "http://superemojitranslator.com/emoji-translate", data={'phrase-to-translate': text})
        tree = html.fromstring(review_r.text)
        translated = tree.xpath(
            '//*[@id="translated-phrase"]')[0].text
        emojis = '|'.join(re.findall(emoji_pattern, translated))
        print(emojis)
        if emojis == '':
            return None
        output = {
            'name': row['name'],
            'city': row['location'],
            'lat': row['lat'],
            'long': row['lng'],
            'category': row['category'],
            'emojis': emojis
        }
        return output
    except Exception as e:
        traceback.print_exc()


def process_row(row):
    # p = Pool(10)
    try:
        if row['reviews'] == None or row['reviews'] == '':
            return None
        reviews_r = requests.get(row['reviews'])
        work = [[row, review] for review in reviews_r.json()]
        outputs = list(map(convert_review, work))
        return outputs
    except Exception as e:
        traceback.print_exc()
        sys.stderr.write(str(e)+"\n")


with open(sys.argv[2], 'w+') as outfile:
    with open(sys.argv[1]) as csvfile:
        p = Pool(4)
        r = csv.DictReader(csvfile)
        outputs = p.map(process_row, r)
        for output in outputs:
            outfile.write(json.dumps(output)+'\n')
            outfile.flush()
