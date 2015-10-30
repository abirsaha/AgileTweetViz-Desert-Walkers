# encoding: utf-8
from django.db import models
from twitter import *
import simplejson as json
from datetime import datetime
import uuid
from sentiment import get_sentiment
from gender import *



# Create your models here.


class Twit(models.Model):
    """
    A model class describing a twit.
    """
    slug = models.SlugField(unique=True)
    tweet_id = models.PositiveIntegerField(u'Tweet ID')
    text = models.TextField(u'Text', blank=True)
    created_at = models.TextField(u'Created At', blank=True)
    user_id = models.PositiveIntegerField(u'User ID', null=True)
    screen_name = models.TextField(u'Screen Name', blank=True)
    username = models.TextField(u'Username', blank=True)
    hashtags = models.TextField(u'Hashtags', blank=True)
    statuses_count = models.PositiveIntegerField(u'Statuses Count', null=True)
    listed_count = models.PositiveIntegerField(u'Listed Count', null=True)
    friends_count = models.PositiveIntegerField(u'Friends Count', null=True)
    user_location = models.TextField(u'User Location', blank=True)
    time_zone = models.TextField(u'Time Zone', blank=True)
    retweet_count = models.PositiveIntegerField(u'Retweet Count', null=True)
    possibly_sensitive = models.TextField(u'Possibly Sensitive', blank=True)
    geo = models.TextField(u'Geo', blank=True)
    favourite_count = models.PositiveIntegerField(u'Favorite Count', null=True)

    def __unicode__(self):
        return self.text

class Twitjson(models.Model):
    # CREATE TABLE Raw_JSONs (ID INTEGER PRIMARY KEY ASC, T DATE DEFAULT (datetime('now','localtime')), JSON text);
    time = models.IntegerField(unique=True)
    json = models.TextField(u'JSON', blank=True)
    def __unicode__(self):
        return self.time


class hashtaginput(models.Model):
    hashtag = models.CharField(blank=True, max_length=200)
    def __unicode__(self):
        return self.hashtag

class jsonoutput(models.Model):
    jsonout = models.TextField()
    def __unicode__(self):
        return self.jsonout


# needs to be removed from final deliverable
def data_analysis(statuses):
    lang = {}
    time_zone = {}
    follower_count = {"0-50": 0, "50-100": 0, "100-150": 0, "150-200": 0, "200-250": 0, "greater than 250": 0}
    retweet_count = {"0-50": 0, "50-100": 0, "100-150": 0, "150-200": 0, "200-250": 0, "greater than 250": 0}
    hashtag_count = {}

    for tweet in statuses:
        if tweet["lang"] in lang:
            lang[tweet["lang"]] += 1
        else:
            lang[tweet["lang"]] = 1

        if tweet["user"]["time_zone"] in location:
            time_zone[tweet["user"]["time_zone"]] += 1
        else:
            time_zone[tweet["user"]["time_zone"]] = 1

        for i in range(50, 300, 50):
            if tweet["user"]["followers_count"] < i:
                follower_count[str(i-50) + "-" + str(i)] += 1
                break
            if tweet["retweet_count"] < i:
                retweet_count[str(i-50) + "-" + str(i)] += 1
                break

        if tweet["user"]["followers_count"] > 250:
            follower_count["greater than 250"] += 1
        if tweet["retweet_count"] > 250:
            retweet_count["greater than 250"] += 1

        if len(tweet["entities"]["hashtags"]) in hashtag_count:
            hashtag_count[len(tweet["entities"]["hashtags"])] += 1
        else:
            hashtag_count[len(tweet["entities"]["hashtags"])] = 1

        # Getting junk data from location. Therefore, cannot be used for visualization
        print "Lang: " + str(lang)
        print "Time Zone: " + str(time_zone)
        print "Followers Count Range: " + str(follower_count)
        print "Retweet Count Range: " + str(retweet_count)
        print "HashTag Count:" + str(hashtag_count)


def twitter_parser(string):
    ACCESS_TOKEN = '3874778652-LoED5AsqqgbUb2PeWCqP9msOykUQuGyUDSWw2l6'
    ACCESS_SECRET = 'Poof3neY7m5NUgqZUfwLb1NHFNxkEljkm6kKeXoj4G7q3'
    CONSUMER_KEY = 'slap8gmZmuzsSlfmR2TYroQtp'
    CONSUMER_SECRET = 'E72rVOBNg20Zq8p3xZMGlAub2s1TlDaVXmBWKhKCJFCuse418u'
    oauth = OAuth(ACCESS_TOKEN, ACCESS_SECRET, CONSUMER_KEY, CONSUMER_SECRET)
    # Initiate the connection to Twitter Streaming API
    twitter = Twitter(auth=oauth)
    search_results = twitter.search.tweets(q= string, count='100')
	user_gender = Gender();

    statuses = search_results['statuses']
    while len(statuses) < 300:
        try:
            next_results = search_results['search_metadata']['next_results']
        except KeyError, e: # No more results when next_results doesn't exist
            break
        kwargs = dict([kv.split('=') for kv in next_results[1:].split("&")]) # Create a dictionary from the query string params
        search_results = twitter.search.tweets(**kwargs)
        print len(statuses)
        statuses += search_results['statuses']
    jsonlist = []
    month = {
        'Jan': 1,
        'Feb': 2,
        'Mar': 3,
        'Apr': 4,
        'May': 5,
        'Jun': 6,
        'Jul': 7,
        'Aug': 8,
        'Sep': 9,
        'Oct': 10,
        'Nov': 11,
        'Dec': 12
    }
    # Can be called when analysing data
    # data_analysis(statuses)
    for tweet in statuses:
        data = {}
        data["screenname"] = tweet["user"]["screen_name"]
        data["date"] = tweet["created_at"]
        data["value"] = tweet["user"]["statuses_count"]
        data["text"] = tweet["text"]
        data["sentiment"] = get_sentiment(tweet["text"])
        date = tweet["created_at"].split()
        data["year"] = date[len(date)-1]
        data["month"] = month[date[1]]
        data["day"] = date[2]
        data["minutes"] = int(date[3].split(":")[1])
        data["lang"] = tweet["lang"]
		data["gender"] = user_gender.get(data["screenname"])
        jsonlist.append(data)
    return json.dumps(jsonlist)
