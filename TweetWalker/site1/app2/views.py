from django.shortcuts import render
from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.template import Context, loader
import pika
# Create your views here.

from .models import Twit
from models import twitter_parser
#import pdb; pdb.set_trace()
from forms import twitterForm
from forms import indexForm
from django.core.context_processors import csrf
import simplejson as json

def create_queue(string):
    #setup rabbitMQ Connection
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
    channel = connection.channel()
    #set max queue size
    args = {"x-max-length": 2000}
    channel.queue_declare(queue='argument_queue', arguments=args)
    channel.basic_publish(exchange='',
                            routing_key='argument_queue',
                            body=string)
def dashboard(request):
    print "in dashboard"
    if request.POST:
        print "in dashboard post"
        if 'get_tweets_dashboard' in request.POST:
            string = request.POST['hashtag_dashboard']
            y = twitter_parser(string)
            form = y
            args = {}
            args.update(csrf(request))
            args['form'] = form
            return render(request,'app2/dashboard.html', args)
    else:
        form = x
        args = {}
        args.update(csrf(request))
        args['form'] = form
        return render(request,'app2/dashboard.html', args)

def landingpage(request):
    print "in landingpage"
    if request.POST:
        if 'get_tweets' in request.POST:
            form = twitterForm(request.POST)
            if form.is_valid():
                string = request.POST['hashtagInput']
                global x
                x = twitter_parser(string)
            return HttpResponseRedirect('app2/dashboard')
        elif 'get_map' in request.POST:
            form = twitterForm(request.POST)
            if form.is_valid():
                string = request.POST['hashtagInput']
                #global x
                #x = twitter_parser(string)
                create_queue(string)
            return HttpResponseRedirect('geo/geomap')
    else:
        form = twitterForm()
        args = {}
        args.update(csrf(request))
        args['form'] = form
        return render(request,'app2/home.html', args)
