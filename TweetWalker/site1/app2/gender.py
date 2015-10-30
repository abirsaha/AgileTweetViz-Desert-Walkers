import random
from nltk import FreqDist
from nltk.corpus import names
import nltk.classify.util

def gender_features(word):
    """
    Extracting the last_letter and First_letter 
    of the name
    """
    featdict = {}
    featdict['last_letter'] = word[-1]
    featdict['first_letter'] = word[0]
    return featdict

class Gender(object):
    """
        Take name as input using BayerClassifier return the
        most probable tag(male/female)
    """

    def __init__(self):
        super(Gender, self).__init__()        
        labeled_names = ([(name, 'male') for name in names.words('male.txt')] +
        [(name, 'female') for name in names.words('female.txt')])
        random.shuffle(labeled_names)
        featuresets = [(gender_features(n), gender) for (n, gender) in labeled_names]
        train_set = featuresets
        #print train_set[0]
        #Training data for the BayerClassifier
        self.classifier = nltk.NaiveBayesClassifier.train(train_set) 	
     
    def get(self,name):
        return self.classifier.classify(gender_features(name))

  
def main():
    #pass unsupervised data to, find male and female
    x = Gender()
    y = x.get('Jyotinder')
    print y

if __name__ == '__main__':
    main()