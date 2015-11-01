from decimal import Decimal

def get_impact_factor(retweet_count, max_retweet_count,
                      followers_count, max_followers_count,
                      statuses_count, max_statuses_count):
    """
    Gives the impact factor for the set of fetched tweets.
    It is evaluated based on the number of retweets,
    followers and statuses compared to the max values of each.
    :param retweet_count: number of retweets
    :param max_retweet_count: max number of retweets for the set of fetched tweets
    :param followers_count: number of followers
    :param max_followers_count: max number of followers for the set of fetched tweets
    :param statuses_count: number of statuses
    :param max_statuses_count: max number of statuses for the set of fetched tweets
    :return:
    """
    return Decimal(
        Decimal(Decimal(retweet_count)/Decimal(2*max_retweet_count)) +\
        Decimal(Decimal(3*followers_count)/Decimal(10*max_followers_count)) +\
        Decimal(Decimal(statuses_count)/Decimal(5*max_statuses_count))
    )
