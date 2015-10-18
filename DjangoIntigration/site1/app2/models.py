# encoding: utf-8
from django.db import models
from twitter import *
import simplejson as json
from datetime import datetime
import uuid



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
	#slug = models.SlugField(unique=True)
	time = models.IntegerField(unique=True)
	json = models.TextField(u'JSON', blank=True)	
	def __unicode__(self):
		return self.time


class hashtaginput(models.Model):
	hashtag = models.CharField(blank=True,max_length=200)
	def __unicode__(self):
		return self.hashtag

class jsonoutput(models.Model):
	jsonout = models.TextField()
	def __unicode__(self):
		return self.jsonout
		
def twitter_parser(string):
	ACCESS_TOKEN = '3874778652-LoED5AsqqgbUb2PeWCqP9msOykUQuGyUDSWw2l6'
	ACCESS_SECRET = 'Poof3neY7m5NUgqZUfwLb1NHFNxkEljkm6kKeXoj4G7q3'
	CONSUMER_KEY = 'slap8gmZmuzsSlfmR2TYroQtp'
	CONSUMER_SECRET = 'E72rVOBNg20Zq8p3xZMGlAub2s1TlDaVXmBWKhKCJFCuse418u'
	oauth = OAuth(ACCESS_TOKEN, ACCESS_SECRET, CONSUMER_KEY, CONSUMER_SECRET)
	# Initiate the connection to Twitter Streaming API
	twitter_stream = TwitterStream(auth=oauth)
	iterator = twitter_stream.statuses.sample()
	twitter = Twitter(auth=oauth)
	search_results = twitter.search.tweets(q= '#' + string, lang='en', count='1')

	statuses = search_results['statuses']
	while True:
		try:
			next_results = search_results['search_metadata']['next_results']
		except KeyError, e: # No more results when next_results doesn't exist
			break
		kwargs = dict([kv.split('=') for kv in next_results[1:].split("&")]) # Create a dictionary from the query string params
		search_results = twitter.search.tweets(**kwargs)
		#print len(statuses)
		statuses += search_results['statuses']

	#print len(statuses)
	#count =0
	#for tweet in statuses:
		#jsonData = Twitjson(time = count,json = tweet)
		#jsonData.save()
		#count +=1
		#print tweet
	return statuses