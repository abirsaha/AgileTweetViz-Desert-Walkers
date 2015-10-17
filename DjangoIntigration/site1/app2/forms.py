from django import forms
from models import hashtaginput


class twitterForm(forms.ModelForm):

	class Meta:
		model = hashtaginput
		fields = '__all__'