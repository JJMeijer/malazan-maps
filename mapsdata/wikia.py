import re

from mediawiki import MediaWiki
from bs4 import BeautifulSoup

malazan = MediaWiki(
    url='https://malazan.fandom.com/api.php',
    user_agent='MalazanMaps/1.0 (https://malazanmaps.com)'
)

def get_first_paragraph(title):
    """Get first paragraph of wiki page"""
    page = malazan.page(title)

    soup = BeautifulSoup(page.html, 'html.parser')

    all_paragraphs = soup.select('.mw-parser-output > p')

    for paragraph in all_paragraphs:
        if not paragraph.find('aside'):
            cleaned_text = re.sub(r"\[\d+\]", '', paragraph.text)
            return cleaned_text
