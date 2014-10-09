# Rand'On server

# Get ready as a contributor

Install heroku toolbelt from  https://toolbelt.herokuapp.com 

Log in using 
```
heroku login
```

## Clone

```
heroku keys:add
heroku git:clone --app <appName>
```

## Commit all changes

```
git add .
git commit -a -m "Description of the changes I made"
git push heroku master
git push github master
```

## Running Locally

```
npm install
npm start
```

## Running on Heroku

```
heroku open
```
