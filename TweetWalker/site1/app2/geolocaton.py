#Import the necessary methods from tweepy library
from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
import json
import re
import pandas as pd
from geopy.geocoders import Nominatim
import Queue
from threading import Thread
import time


#Variables that contains the user credentials to access Twitter API 
access_token = "4116969794-tLPUT7YG4mphyF3rqSC0xCwOXzdmNh54Io3S61X"
access_token_secret = "GNUhLaEHP3koxCZmIjomL3DNwUoViWEUzmwZiBUgdPzgN"
consumer_key = "SyMNs7ARJ6e2ZYjbQxQIsdpHv"
consumer_secret = "e3eG9oBbOPUxErq00KcXMGeWTpsFYVNu0XpxRwlAQAe6lxhWOF"

tweets_data = []
q = Queue.Queue()
#This is a basic listener that just prints received tweets to stdout.
class standard_out_listener(StreamListener):
    
    def on_data(self, data):
        
        #print data
        tweet = json.loads(data)
        q.put(tweet)
        #if tweet.has_key('geo'):
         #   print tweet['geo']
        #if tweet.has_key('place'):
        #    print tweet['place']
        #if tweet.has_key('user'):
        # if tweet.has_key('user'):
            # if tweet['user'].has_key('time_zone'):
                # if tweet['user']['time_zone'] is not None :
                    # words = re.findall(r'\w+', tweet['user']['time_zone'])
                    # #print words
                    # if  len(words) == 1:
                        # try:
                            # print tweet['user']['time_zone']
                            # geolocator = Nominatim()
                            # location = geolocator.geocode(tweet['user']['time_zone'], timeout=None)
                            # print((location.latitude, location.longitude))
                        # except:
                            # pass
        #print tweet[location]
        #print tweet['id']
        #if tweet.has_key('location'):
            #print tweet['location']
        # tweets_data.append(tweet)
        # tweets = {}
        # tweets['text'] = map(lambda tweet: tweet['text'], tweets_data)
        # tweets['lang'] = map(lambda tweet: tweet['lang'], tweets_data)
        # tweets['country'] = lambda tweet: tweet['place']['country'] if tweet['place'] != None else None, tweets_data)
        # if tweets['country'] is not None:
            # print tweets['country']

        #if tweet.has_key('time_zone'):
            #print tweet['time_zone']
        #for key, value in tweet.iteritems() :
            #print key, value
            #if isinstance(value, str):
                #print key, value
            #else
                #print key,ord(c)
        #print tweet
        return True

    def on_error(self, status):
        print status

def read_queue():
    while True:
        while not q.empty():
            tweet = q.get()
            if tweet.has_key('user'):
                if tweet['user'].has_key('time_zone'):
                    if tweet['user']['time_zone'] is not None :
                        words = re.findall(r'\w+', tweet['user']['time_zone'])
                        #print words
                        if  len(words) == 1:
                            try:
                                print tweet['user']['time_zone']
                                geolocator = Nominatim()
                                location = geolocator.geocode(tweet['user']['time_zone'], timeout=None)
                                print((location.latitude, location.longitude))
                            except:
                                pass
 
if __name__ == '__main__':

    t = Thread(target=read_queue)
    t.daemon = True
    t.start()

    #This handles Twitter authetification and the connection to Twitter Streaming API
    l = standard_out_listener()
	
    auth = OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    stream = Stream(auth, l)

    #This line filter Twitter Streams to capture data by the keywords: 'python', 'javascript', 'ruby'
    stream.filter(track=['LA'])
    