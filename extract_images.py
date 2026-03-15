import re
import os
import urllib.request
import urllib.parse
from html.parser import HTMLParser

class MyHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = set()
    
    def handle_starttag(self, tag, attrs):
        if tag == 'img':
            for attr in attrs:
                if attr[0] == 'src' and attr[1]:
                    self.urls.add(attr[1])
        # Also check style attributes for url()
        for attr in attrs:
            if attr[0] == 'style' and attr[1]:
                matches = re.findall(r'url\([\'\"]?(.*?)[\'\"]?\)', attr[1])
                for m in matches:
                    self.urls.add(m)

def download_images():
    try:
        with open('odr_homepage.html', 'r', encoding='utf-8') as f:
            html = f.read()
    except FileNotFoundError:
        print('odr_homepage.html not found')
        return

    parser = MyHTMLParser()
    parser.feed(html)
    urls = parser.urls

    # Find embedded style tags
    matches = re.findall(r'url\([\'\"]?(.*?)[\'\"]?\)', html)
    for m in matches:
        urls.add(m)

    base_url = 'https://www.odrrestaurant.com/'
    full_urls = set()
    for u in urls:
        if u.startswith('data:'):
            continue
        full_url = urllib.parse.urljoin(base_url, u)
        full_urls.add(full_url)

    os.makedirs('assets/images', exist_ok=True)
    print(f'Found {len(full_urls)} images, downloading...')

    for i, fu in enumerate(full_urls):
        filename = fu.split('/')[-1].split('?')[0]
        if not filename:
            filename = f'image_{i}.jpg'
        filepath = os.path.join('assets/images', filename)
        try:
            req = urllib.request.Request(fu, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=10) as response, open(filepath, 'wb') as out_file:
                data = response.read()
                out_file.write(data)
                print(f'Downloaded {filename}')
        except Exception as e:
            print(f'Failed to download {fu}: {e}')

if __name__ == '__main__':
    download_images()
