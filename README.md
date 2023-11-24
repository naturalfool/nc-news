# Northcoders News API


This is a project that serves as a back-end environment for a news api. It serves up articles, comments, and users of the news website.
Check out the hosted api here: https://nc-news-aa8x.onrender.com

This repo requires two environment variables in order to successfully connect to the correct databases locally. 
To do this, please create two files calles '.env.test', and '.env.development', both containing "PGDATABASE=nc_news_test" and "PGDATABASE=nc_news" respectively. 

STEP 1 - Setting up the repository.
- Start by forking and cloning this repository https://github.com/naturalfool/nc-news
- cd into be-nc-news

STEP 2 - Install the correct dependencies.
- npm install jest -D
- npm install supertest
- npm install express
- npm install pg

STEP 3 - Setup the databases.
- Setup the database by running the script 'npm run setup-dbs' 
- Run the seed with 'npm run seed'

RUNNING TESTS
- The tests on this api were designed using jest and jest sorted. All tests are found within the __tests__ file, and npm test app.test.js will run the test.
- There are some utility functions that were used for a few bits of logic throughout the project. These tests can be run with npm test utils.test.js.


