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

def gender_classifier(actor):
    """
        Take name as input using BayerClassifier return the
        most probable tag(male/female)
    """
    
    labeled_names = ([(name, 'male') for name in names.words('male.txt')] +
    [(name, 'female') for name in names.words('female.txt')])
    random.shuffle(labeled_names)
    featuresets = [(gender_features(n), gender) for (n, gender) in labeled_names]
    train_set = featuresets
    #print train_set[0]
    #Training data for the BayerClassifier
    classifier = nltk.NaiveBayesClassifier.train(train_set) 	
    #print classifier.show_most_informative_features(100)
    return classifier.classify(gender_features(actor))
  
def main():
    #pass unsupervised data to, find male and female
    x = gender_classifier('Jyotinder')
    print x

if __name__ == '__main__':
    main()