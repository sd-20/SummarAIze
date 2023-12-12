"""
Module for scraping web pages and extracting important words using TF-IDF and frequency analysis.
"""
from collections import Counter
import requests
from bs4 import BeautifulSoup
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd

# Download necessary NLTK resources
nltk.download("punkt")
nltk.download("stopwords")


### Cited source: https://pytutorial.com/how-to-get-text-method-beautifulsoup/, Author: Alexander Williams
def get_text(url, timeout=10):
    """
    Retrieves and extracts text from a webpage.

    :param url: URL of the webpage to scrape.
    :param timeout: Timeout for the requests call.
    :return: A string of important words extracted from the webpage.
    """

    response = requests.get(url, timeout=timeout)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, "html.parser")
        text = soup.get_text(separator="\n", strip=True)
        return extract_important_words(text)
    return ""


def extract_important_words(text, top_n=100):
    """
    Extracts the top_n important words from the given text based on frequency and tf-idf scores.

    :param text: The text to process.
    :param top_n : The number of top words to return.
    :return: A string representation of the list of top N important words.
    """

    words = word_tokenize(text)
    filtered_words = [
        word for word in words if word.lower() not in stopwords.words("english")
    ]
    word_counts = Counter(filtered_words)
    corpus = [text]

    vectorizer = TfidfVectorizer(stop_words=stopwords.words("english"))
    tfidf_matrix = vectorizer.fit_transform(corpus)
    feature_names = vectorizer.get_feature_names_out()
    tfidf_scores = pd.Series(tfidf_matrix.toarray().flatten(), index=feature_names)

    combined_scores = pd.DataFrame(
        {"frequency": word_counts, "tfidf": tfidf_scores}
    ).fillna(0)
    combined_scores = combined_scores.assign(
        combined_score=combined_scores["frequency"] * combined_scores["tfidf"]
    )
    top_words = combined_scores.sort_values(by="combined_score", ascending=False).head(
        top_n
    )

    return str(top_words.index.tolist())
