# linkedin-parser

`linkedin/` folder contains code for chrome extension

* GET DATA button works on Linkedin sales navigator search results page. It posts data back to mongo server.
* GET PROFILE button works on Linkedin sales navigator profile page. It only does console logging.

## Mongo Server

* To install eve on terminal run : `pip install eve`
* Go to folder `mongo-server/`
* From terminal run : `python run.py` 
* Server should be running on port 5000
* Test by running `curl http://localhost:5000/profiles`