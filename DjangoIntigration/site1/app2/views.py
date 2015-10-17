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
from django.core.context_processors import csrf

def index(request):
    twits = Twit.objects.all()
    t = loader.get_template('app2/index.html')
    c = Context({'object_list': twits})
    return HttpResponse(t.render(c))
	
def indexSubmit(request):
	print 'xxxjgj'
	if request.POST:
		print 'xxx'
		form = twitterForm(request.POST)
		if form.is_valid():
			string = request.POST['hashtag']
			print(string)
			twitter_parser(string)
			#form.clear()
			#return HttpResponse('')
	else:
		form = twitterForm()
	
	args = {}
	args.update(csrf(request))
	args['form'] = form
	return render(request,'app2/indexSubmit.html', args)
		
	#args = {}
	#args['form'] = form
	#return HttpResponse('hello')
	#return render_to_response('indexSubmit.html',args)



# def index(request):
    # twits = Twit.objects.all()
    # t = loader.get_template('app2/index.html')
    # c = Context({'object_list': twits})
    # return HttpResponse(t.render(c))