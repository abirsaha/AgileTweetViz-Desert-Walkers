__author__ = 'ayushgupta'

from twitter import *
import simplejson as json

ACCESS_TOKEN = '3874778652-LoED5AsqqgbUb2PeWCqP9msOykUQuGyUDSWw2l6'
ACCESS_SECRET = 'Poof3neY7m5NUgqZUfwLb1NHFNxkEljkm6kKeXoj4G7q3'
CONSUMER_KEY = 'slap8gmZmuzsSlfmR2TYroQtp'
CONSUMER_SECRET = 'E72rVOBNg20Zq8p3xZMGlAub2s1TlDaVXmBWKhKCJFCuse418u'

oauth = OAuth(ACCESS_TOKEN, ACCESS_SECRET, CONSUMER_KEY, CONSUMER_SECRET)

# Initiate the connection to Twitter Streaming API
twitter_stream = TwitterStream(auth=oauth)
iterator = twitter_stream.statuses.sample()
twitter = Twitter(auth=oauth)
search_results = twitter.search.tweets(q='#windows', lang='en', count='1000')

statuses = search_results['statuses']
while True:
    try:
        next_results = search_results['search_metadata']['next_results']
    except KeyError, e: # No more results when next_results doesn't exist
        break
    kwargs = dict([kv.split('=') for kv in next_results[1:].split("&")]) # Create a dictionary from the query string params
    search_results = twitter.search.tweets(**kwargs)
    print len(statuses)
    statuses += search_results['statuses']

print len(statuses)

check = False
# print json.dumps(iterator["search_metadata"], indent=4)
for tweet in statuses:
    # Twitter Python Tool wraps the data returned by Twitter
    # as a TwitterDictResponse object.
    # We convert it back to the JSON format to print/score
    # print json.dumps(tweet)
    if check is False:
        with open('data.txt', 'w') as outfile:
            json.dump(tweet, outfile)
            outfile.write("\n")
            check = True
    else:
        with open('data.txt', 'a') as outfile:
            json.dump(tweet, outfile)
            outfile.write("\n")
    # The command below will do pretty printing for JSON data, try it out
    # print json.dumps(tweet, indent=4)

# tweets_file = open("data.txt", "r")
# with open("test.csv", "w") as output:
#     header = "Tweet ID," +\
#              "Text," +\
#              "Created At," +\
#              "User ID," +\
#              "Screen Name," +\
#              "Username," +\
#              "Hashtags," +\
#              "Statuses Count," +\
#              "Listed Count," +\
#              "Friends Count," +\
#              "User Location," +\
#              "Time Zone," +\
#              "Retweet Count," +\
#              "Possibly Sensitive," +\
#              "Geo," +\
#              "Favourite Count,"
#              # "Timestamp ms," +\
#              # "User Mentions," +\
#              # "Symbols," +\
#              # "Trends," +\
#
#     output.write(header)
#     output.write("\n")
# for line in tweets_file:
#     try:
#         # Read in one line of the file, convert it into a json object
#         tweet = json.loads(line.strip())
#         if 'text' in tweet: # only messages contains 'text' field is a tweet
#             hashtags = ""
#             for hashtag in tweet['entities']['hashtags']:
#                 hashtags += str(hashtag['text']) + "|"
#             # usermentions = ""
#             # for usermention in tweet['entities']['user_mentions']:
#             #     usermentions += str(usermention['text']) + " "
#             # symbols = ""
#             # for symbol in tweet['entities']['symbols']:
#             #     symbols += str(symbol['text']) + " "
#             # trends = ""
#             # for trend in tweet['entities']['trends']:
#             #     trends += str(trend['text']) + " "
#             # urls = ""
#             # for url in tweet['entities']['urls']:
#             #     urls += str(url['text']) + " "
#
#             with open("test.csv", 'a') as out:
#                 row = tweet['id_str'] + "," +\
#                       tweet['text'] + "," +\
#                       tweet['created_at'] + "," +\
#                       tweet['user']['id_str'] + "," +\
#                       tweet['user']['screen_name'] + "," +\
#                       tweet['user']['name'] + "," +\
#                       hashtags + "," +\
#                       str(tweet['user']['statuses_count']) + "," +\
#                       str(tweet['user']['listed_count']) + "," +\
#                       str(tweet['user']['friends_count']) + "," +\
#                       str(tweet['user']['location']) + "," +\
#                       str(tweet['user']['time_zone']) + "," + \
#                       str(tweet['retweet_count']) + ","
#                       # str(tweet['possibly_sensitive']) + "," +\
#                       # str(tweet['geo']) + "," +\
#                       # str(tweet['favorite_count']) + ","
#                       # # str(tweet['timestamp_ms']) + "," +\
#                       # usermentions + "," +\
#                       # symbols + "," +\
#                       # trends + "," +\
#                       # urls + "," +\
#                 out.write(row)
#                 out.write("\n")
            # print "id" + str(tweet['id']) # This is the tweet's id
            #
            # print tweet['created_at'] # when the tweet posted
            # print tweet['text'] # content of the tweet
            #
            # print tweet['user']['id'] # id of the user who posted the tweet
            # print tweet['user']['name'] # name of the user, e.g. "Wei Xu"
            # print tweet['user']['screen_name'] # name of the user account, e.g. "cocoweixu"
            #
            # hashtags = []
            # for hashtag in tweet['entities']['hashtags']:
            #     hashtags.append(hashtag['text'])
            # print hashtags

    # except:
    #     # read in a line is not in JSON format (sometimes error occured)
    #     print "error"
    #     continue