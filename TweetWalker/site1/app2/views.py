from django.shortcuts import render
from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.template import Context, loader
# Create your views here.

from .models import Twit
from models import twitter_parser
from forms import twitterForm
from forms import indexForm
from django.core.context_processors import csrf


def index(request):
<<<<<<< Updated upstream
	# form = indexForm(initial={'jsonout': x})
	form = x
	twits = Twit.objects.all()
	args = {}
	args.update(csrf(request))
	args['form'] = form
	return render(request,'app2/dashboard.html', args)
=======
    form = x
    # twits = Twit.objects.all()
    args = {}
    args.update(csrf(request))
    args['form'] = form
    return render(request,'app2/index.html', args)
>>>>>>> Stashed changes


def indexSubmit(request):
    print "in indexsumbmit"
    if request.POST:
        form = twitterForm(request.POST)
        if form.is_valid():
            string = request.POST['hashtagInput']
            global x
            x = twitter_parser(string)
            return HttpResponseRedirect('app2/index')

    else:
        form = twitterForm()
<<<<<<< Updated upstream
	args = {}
	args.update(csrf(request))
	args['form'] = form
	return render(request,'app2/home.html', args)
=======
    args = {}
    args.update(csrf(request))
    args['form'] = form
    return render(request,'app2/indexSubmit.html', args)
>>>>>>> Stashed changes
