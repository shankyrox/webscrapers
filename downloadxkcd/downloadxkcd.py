#! python3.6
# downloadxkcd.py : Download all XKCD comics

import requests, os, bs4

url = 'https://xkcd.com/1/'
iterator = 1

os.makedirs('xkcd', exist_ok=True)
while not url.endswith('#'):
    # Download the page
    res = requests.get(url)
    res.raise_for_status()

    soup = bs4.BeautifulSoup(res.text, 'html.parser')

    comicelement = soup.select('#comic img')
    if not comicelement:
        print('Did not find any comic element')
    else:
        try:
            # Find the path of comic element
            comicurl = 'https:' + comicelement[0].get('src')

            # Download the image
            res = requests.get(comicurl)
            res.raise_for_status()
        except requests.exceptions.MissingSchema:
            pass
        else:
            # Save image if found
            imagefile = open(os.path.join('xkcd', str(iterator) + " " + os.path.basename(comicurl)), 'wb')
            for chunk in res.iter_content(100000):
                imagefile.write(chunk)
            imagefile.close()

        # Get prev button link
        nextlink = soup.select('a[rel="next"]')[0]
        url = 'https://xkcd.com' + nextlink.get('href')
        iterator += 1
