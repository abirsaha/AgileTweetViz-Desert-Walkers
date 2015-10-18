from django import forms
from models import hashtaginput
from models import jsonoutput


class twitterForm(forms.ModelForm):

	class Meta:
		model = hashtaginput
		fields = '__all__'

class indexForm(forms.ModelForm):

	class Meta:
		model = jsonoutput
		fields = '__all__'