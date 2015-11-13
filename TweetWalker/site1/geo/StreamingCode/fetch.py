from geopy.geocoders import Nominatim
import pika
import json
import pandas
from geolocaton import thread_tweet
 #setup queue
connection = pika.BlockingConnection()
channel = connection.channel()

def get_tweets():
    city_location = []
    # Get ten messages and break out
    count = 0
    for method_frame, properties, body in channel.consume('argument_queue'):

        
        try:
            # city =json.loads(body)
            # #print city['city']
            # geolocator = Nominatim()
            # location = geolocator.geocode(city['city'], timeout=None)                  
            # print((location.latitude, location.longitude))
            print(body)
            channel.basic_ack(method_frame.delivery_tag)
            thread_tweet(body)
        except:
            print "error"
            pass

        

    # Cancel the consumer and return any pending messages
    requeued_messages = channel.cancel()
    print 'Requeued %i messages' % requeued_messages

    return tweets
    
    

if __name__ == '__main__':
    get_tweets()