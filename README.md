# webscrapers - Python

Container for all webscrappers created by me. Most problem statements are real world requirements picked up from jobs posted online

PYTHON VERSION : 3.6.1

NOTE : Make sure all the modules imported at the top of any .py module are installed before executed 

Detailed information about each webscraper is present in `problem.txt` file added to each folder. Below is a brief description of the task done by each of these : 

* **companysearch :** Read the company name and location from list of companies in "CompanyList.xlsx". Search for this company on google, retrieve the link for top 5 results and save it to "SearchResults.xlsx" against the company name.
* **downloadxkcd :** Download all comics from "https://xkcd.com/" using the next button and save it to folder ./xkcd/ 
* **linkedincontacts :** From linkedin website search for a title (ceo, head of sales, etc.) or person or company. Find the list of people matching that criteria. Store all the results (max 100 results) to search.xlsx along with the details. 
* **tennisresults :** Take a link id and category as input and fetch the results of a match from http://tennislink.usta.com/Tournaments

# Webscraping via JavaScript

* **chrome :** This folder contains a chrome extension which extracts information from popular websites - *Twitter, Facebook* and *Instagram*. It uses Javascript to pull data from these websites.
* **linkedin-parser** This folder contains a fully working chrome extension which can parse search results from a linkedin sales navigator page, visit each profile on the page and extract all details including experience and education. The information is stored in json format and POSTed back to a mongodb server.
