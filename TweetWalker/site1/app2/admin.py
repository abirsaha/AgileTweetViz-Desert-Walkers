from django.contrib import admin
from .models import Twit
from .models import Twitjson
# Register your models here.


class TwitAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ['tweet_id']}
#class TwitjsonAdmin(admin.ModelAdmin):
   # prepopulated_fields = {'slug': ['time']}

admin.site.register(Twit, TwitAdmin)
#admin.site.register(Twitjson, TwitjsonAdmin)
