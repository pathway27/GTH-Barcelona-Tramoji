import csv
import requests
import re
import IPython
from lxml import html
import json
from time import sleep
import sys
from googletrans import Translator


emoji_pattern = re.compile("["
                           u"\U0001F600-\U0001F64F"  # emoticons
                           u"\U0001F300-\U0001F5FF"  # symbols & pictographs
                           u"\U0001F680-\U0001F6FF"  # transport & map symbols
                           u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
                           "]+", flags=re.UNICODE)

with open(sys.argv[2], 'w+') as outfile:
    with open(sys.argv[1]) as csvfile:
        r = csv.DictReader(csvfile)
        for row in r:
            try:
                reviews_r = requests.get(row['reviews'])
                reviews = json.loads(reviews_r.text)
                for review in reviews_r.json():
                    try:
                        text = ''
                        if review['language'] != 'en':
                            translator = Translator()
                            text = translator.translate(review['text']).text
                        else:
                            text = review['text']
                        review_r = requests.post(
                            "http://superemojitranslator.com/emoji-translate", data={'phrase-to-translate': text})
                        tree = html.fromstring(review_r.text)
                        translated = tree.xpath(
                            '//*[@id="translated-phrase"]')[0].text
                        emojis = '|'.join(re.findall(emoji_pattern, translated))
                        if emojis == '':
                            continue
                        output = {
                            'name': row['name'],
                            'city': row['location'],
                            'lat': row['lat'],
                            'long': row['lng'],
                            'category': row['category'],
                            'emojis': emojis
                        }
                        sys.stderr.write(emojis+'\n')
                        outfile.write(json.dumps(output)+'\n')
                        outfile.flush()
                        # sleep(0.05)
                    except Exception:
                        pass
            except Exception:
                pass
