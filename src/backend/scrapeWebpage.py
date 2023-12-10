import requests
from bs4 import BeautifulSoup

import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd
from collections import Counter

nltk.download("punkt")
nltk.download("stopwords")


### Cited source: https://pytutorial.com/how-to-get-text-method-beautifulsoup/, Author: Alexander Williams
def get_text(url):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, "html.parser")
        text = soup.get_text(separator="\n", strip=True)
        return extract_important_words(text)
    else:
        return ""


def extract_important_words(text, top_n=50):
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
    combined_scores["combined_score"] = (
        combined_scores["frequency"] * combined_scores["tfidf"]
    )
    top_words = combined_scores.sort_values(by="combined_score", ascending=False).head(
        top_n
    )

    return str(top_words.index.tolist())
