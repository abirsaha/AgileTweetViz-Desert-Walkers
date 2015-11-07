from django.shortcuts import render
from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.template import Context, loader
# Create your views here.

from .models import Twit
from models import twitter_parser
#import pdb; pdb.set_trace()
from forms import twitterForm
from forms import indexForm
from django.core.context_processors import csrf
import simplejson as json


def dashboard(request):
    print "in index"
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
                global x
                x = twitter_parser(string)
            return HttpResponseRedirect('geo/geomap')
    else:
        form = twitterForm()
        args = {}
        args.update(csrf(request))
        args['form'] = form
        return render(request,'app2/home.html', args)
