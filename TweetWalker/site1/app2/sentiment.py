"""
TextBlob is used to process texts.
It provides a simple API for diving into common natural language processing (NLP)
    tasks such as part-of-speech tagging, noun phrase extraction, sentiment analysis,
    classification, translation, and more.
    https://pypi.python.org/pypi/textblob
"""
from textblob import TextBlob


def get_sentiment(text):
    """
    Gives the polarity of the sentiment associated with the given input text
    indicating whether it is positive, negative or neutral in '-1 to 1' range
    :param text: Tweet text
    :return: Polarity of the sentiment as 0(neutral), 1(positive), or 2(negative)
    """
    blob = TextBlob(text)
    # from_lang = blob.detect_language()
    # try:
    #     if from_lang != "en" and from_lang is not None:
    #         blob = blob.translate(from_lang, to="en")
    # except:
    #     a="Translation error"
    sentiment_polarity, sentiment_subjectivity = blob.sentences[0].sentiment
    if sentiment_polarity > 0:
        return 1
    elif sentiment_polarity < 0:
        return 2
    else:
        return 0
