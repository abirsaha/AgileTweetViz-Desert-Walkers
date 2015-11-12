#Import the necessary methods from tweepy library
from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
from tweepy import API
import json
import re
import pandas as pd
from geopy.geocoders import Nominatim
import pika
#Variables that contains the user credentials to access Twitter API 
access_token = "4116969794-tLPUT7YG4mphyF3rqSC0xCwOXzdmNh54Io3S61X"
access_token_secret = "GNUhLaEHP3koxCZmIjomL3DNwUoViWEUzmwZiBUgdPzgN"
consumer_key = "SyMNs7ARJ6e2ZYjbQxQIsdpHv"
consumer_secret = "e3eG9oBbOPUxErq00KcXMGeWTpsFYVNu0XpxRwlAQAe6lxhWOF"




tweets_data = []
#This is a basic listener that just prints received tweets to stdout.
class StdOutListener(StreamListener):
    def __init__(self, api):
        self.api = api
        super(StreamListener, self).__init__()

        #setup rabbitMQ Connection
        connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
        self.channel = connection.channel()

        #set max queue size
        args = {"x-max-length": 2000}

        self.channel.queue_declare(queue='twitter_topic_feed', arguments=args)
    
    def on_data(self, data):
    
        #print data
        tweet = json.loads(data)
        if tweet.has_key('user'):
            if tweet['user'].has_key('time_zone'):
                if tweet['user']['time_zone'] is not None :
                    words = re.findall(r'\w+', tweet['user']['time_zone'])
                    if  len(words) == 1:
                        try:
                            data = {}
                            data['city'] = tweet['user']['time_zone']
                            print data
                            self.channel.basic_publish(exchange='',
                                            routing_key='twitter_topic_feed',
                                            body=json.dumps(data))
                        except:
                            pass
        return True

    def on_error(self, status):
        print status


#if __name__ == '__main__':
def streamfun(str):
    #This handles Twitter authetification and the connection to Twitter Streaming API
    
    auth = OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    api = API(auth)
    l = StdOutListener(api)
    stream = Stream(auth, l)

    #This line filter Twitter Streams to capture data by the keywords: 'python', 'javascript', 'ruby'
    stream.filter(track=[str])
    
if __name__ == '__main__':
    streamfun('LA')