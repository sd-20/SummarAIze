import requests
from bs4 import BeautifulSoup

### Cited source: https://pytutorial.com/how-to-get-text-method-beautifulsoup/, Author: Alexander Williams
def get_text_url(url):
    response = requests.get(url)
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        text = soup.get_text(separator='\n', strip=True)
        return text
    else:
        return "Failed to retrieve text from webpage. Webscraping could be blocked." 

website = input("Enter the website to be summarized: ")
text = get_text_url(website)
with open('output.txt', 'w') as f:
    f.writelines(text)
