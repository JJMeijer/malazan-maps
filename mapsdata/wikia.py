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

    first_paragraph = soup.select('.mw-parser-output > p:first-of-type')[0].text

    return first_paragraph