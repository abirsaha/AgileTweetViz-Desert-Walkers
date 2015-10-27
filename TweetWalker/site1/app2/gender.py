from nltk.corpus import gutenberg
import random
# import FreqDist class
from nltk import FreqDist
from nltk.corpus import names


def fun_gender(actor):
    labeled_names = ([(name, 'male') for name in names.words('male.txt')] +
    [(name, 'female') for name in names.words('female.txt')])
    random.shuffle(labeled_names)
    featuresets = [(gender_features(n), gender) for (n, gender) in labeled_names]
    train_set, test_set = featuresets[500:], featuresets[:500]
    classifier = nltk.NaiveBayesClassifier.train(train_set) 	
    classifier.classify(gender_features(actor))
  
def main():
    fun_gender('Neo')

if __name__ == '__main__':
    main()