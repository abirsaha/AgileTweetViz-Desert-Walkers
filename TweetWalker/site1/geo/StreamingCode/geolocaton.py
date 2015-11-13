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
import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web
import socket

#Variables that contains the user credentials to access Twitter API 
access_token = "4116969794-tLPUT7YG4mphyF3rqSC0xCwOXzdmNh54Io3S61X"
access_token_secret = "GNUhLaEHP3koxCZmIjomL3DNwUoViWEUzmwZiBUgdPzgN"
consumer_key = "SyMNs7ARJ6e2ZYjbQxQIsdpHv"
consumer_secret = "e3eG9oBbOPUxErq00KcXMGeWTpsFYVNu0XpxRwlAQAe6lxhWOF"

tweets_data = []
q = Queue.Queue()


'''
This is a simple Websocket Echo server that uses the Tornado websocket handler.
Please run `pip install tornado` with python of version 2.7.9 or greater to install tornado.
This program will echo back the reverse of whatever it recieves.
Messages are output to the terminal for debuggin purposes. 
''' 
 
class WSHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        print 'new connection'
      
    def on_message(self, message):
        print 'message received:  %s' % message
        # Reverse Message and send it back
        #print 'sending back message: %s' % message[::-1]
        while not q.empty():
            tweet = q.get()
            if tweet.has_key('user'):
                if tweet['user'].has_key('time_zone'):
                    if tweet['user']['time_zone'] is not None :
                        words = re.findall(r'\w+', tweet['user']['time_zone'])
                        #print words
                        if  len(words) == 1:
                            try:
                                #print tweet['user']['time_zone']
                                geolocator = Nominatim()
                                location = geolocator.geocode(tweet['user']['time_zone'], timeout=None)
                                #print((location.latitude, location.longitude))
                                data={}
                                data['latitude']=location.latitude
                                data['longitude']=location.longitude
                                self.write_message(data)
                            except:
                                pass

            #self.write_message(message[::-1])
            
            
 
    def on_close(self):
        print 'connection closed'
 
    def check_origin(self, origin):
        return True
 
application = tornado.web.Application([
    (r'/ws', WSHandler),
])
 
 


#This is a basic listener that just prints received tweets to stdout.
class standard_out_listener(StreamListener):
    
    def on_data(self, data):
        tweet = json.loads(data)
        q.put(tweet)
        return True

    def on_error(self, status):
        print status
        
def read_queue():
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(8888)
    myIP = socket.gethostbyname(socket.gethostname())
    print '*** Websocket Server Started at %s***' % myIP
    tornado.ioloop.IOLoop.instance().start()
    
 
def thread_tweet(str='LA'):
    t = Thread(target=read_queue)
    t.daemon = True
    t.start()

    #This handles Twitter authetification and the connection to Twitter Streaming API
    l = standard_out_listener()
	
    auth = OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    stream = Stream(auth, l)

    #This line filter Twitter Streams to capture data by the keywords: 'python', 'javascript', 'ruby'
    stream.filter(track=[str])
    