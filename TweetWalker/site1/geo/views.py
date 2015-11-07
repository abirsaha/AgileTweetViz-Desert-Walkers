from django.shortcuts import render
from django.core.context_processors import csrf

# Create your views here.
def geomap(request):
    print "in geomap"
    args = {}
    args.update(csrf(request))
    return render(request,'geo/geolocation.html', args)