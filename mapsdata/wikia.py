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
        if paragraph.find('aside'):
            continue

        if paragraph.find('span', {'class': 'slug'}):
            continue

        if 'class' in paragraph.attrs and len(paragraph.attrs['class']) > 0:
            if paragraph.attrs['class'][0] == 'mw-empty-elt':
                continue

            if paragraph.attrs['class'][0] == 'slug':
                continue

        if len(paragraph.text) < 2:
            continue

        cleaned_text = re.sub(r"\[\d+\]", '', paragraph.text)
        return cleaned_text
