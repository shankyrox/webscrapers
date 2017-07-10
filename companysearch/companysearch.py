import requests, webbrowser, bs4, openpyxl

# Read data from xlsx file
workbook = openpyxl.load_workbook('CompanyList.xlsx')
readsheet = workbook['Sheet1']

# Write file details
writebook = openpyxl.Workbook()
dstnfile = 'SearchResults.xlsx'
writesheet = writebook.active

iterator = 2
while readsheet['A' + str(iterator)].value is not None:
    companyname = readsheet['A' + str(iterator)].value
    location = readsheet['B' + str(iterator)].value

    # Get search results
    print('Searching for ' + companyname + ', location : ' + location)
    res = requests.get('https://www.google.com/search?q=' + companyname + ' ' + location)
    res.raise_for_status()

    # Retrieve top search results links
    soup = bs4.BeautifulSoup(res.text, 'html.parser')
    # f = open('newfile.html', 'w')    --> Test code for html file
    # f.write(soup.prettify())
    # f.close()

    # Analysis of google search results page tells that all search results links belong to "r" class
    toplinks = soup.select('.r a')
    writesheet.cell(row=iterator - 1, column=1, value=companyname)
    for i in range(min(5, len(toplinks))):
        # webbrowser.open('https://google.com/' + toplinks[i].get('href'))
        row = iterator - 1
        column = i + 2
        writesheet.cell(row=row, column=column, value='https://google.com/' + toplinks[i].get('href'))
    iterator += 1

writebook.save(dstnfile)
