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
If the following error appear :
```
npm ERR! weird error 127
npm WARN This failure might be due to the use of legacy binary "node"
npm WARN For further explanations, please read /usr/share/doc/nodejs/README.Debian
 
npm ERR! not ok code 0

```
Then you have to install the package ```nodejs-legacy``` using :
```
sudo apt-get install nodejs-legacy
```
AND replacing all "node" command with "nodejs" in the Procfile.

## Running on Heroku

```
heroku open
```
