# Software Engineering Project
This is the git Repository for the Savour and Sip app, created for the computer science senior project class, Software Engineering.
The project was built by [Matt G. Hall](githubb.com/mattghall), [Brandon Duncan](githubb.com/brandondunc94), and [Gino Sahagun](GinoSahagun).

## Server
When installing packages on the server, please list them here
- [Set up Digital Ocean Node JS Machine.](https://cloud.digitalocean.com/support/suggestions?article=initial-server-setup-with-ubuntu-14-04&i=bbf02d&page=0&query=ubuntu%20setup)
- [Connect To Droplet with SSH.](https://www.digitalocean.com/community/tutorials/how-to-use-ssh-keys-with-putty-on-digitalocean-droplets-windows-users) Essentially this just requires creating a new public/private key with PuTTY, saving the public key to the server, then saving the private key in PuTTY.
- [Install mongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)


## Enviornment
Instructions for setting up your dev eviornment
- [Install Node.js (32 bit)](https://nodejs.org/en/download/)
- [Install Node.js Tools for Visual Studio](https://www.visualstudio.com/vs/node-js/)
- Pull the Savour Git repo and open the Visual Studio project


## Deploy to server
How to deploy to the server
- Pull the savour-dep Repo
- In Visual Studio, right click on the project, and click *Publish*
- Create New Custom Profile
- Publish method: File System
- Set the target location as the source dir of the dep repo
- Keep Defaults in Settings
- Publish
- Push changes to savour-deployment


## Talk to the database on the server
From any directory, type `mongo --shell`
CTRL^C to exit


## Get data in your local database - please use camel case for table and key names
- Run mongod.exe, then open new command prompt, run mongo.exe
- `> use savour` //Creates Savour database
- `> db.rest.insert({ name : 'Curbside', location : 'Queen Anne'});` _Restaurant collection is created, only using two properties for testing_
- `> show collections` _to view the created collections/tables_
- `> db.rest.find({})` _List all elements in Restaurant collection, should list 'curbside' at this point_
- `> db.rest.insert({ name : '', location : ''});` _Repeat to add more restaurants_

#### I added these two to my test db
- `> db.rest.insert({ name : "Test Restaurant", phone : "(206) 421-1061", hours: "{'SUN': '9-5', 'MON': '9-5', 'TUE': '9-5', 'WED': '9-5', 'THU': '9-5', 'FRI': '9-5', 'SAT': '9-5'}",pricing:3, rating:3, address:"3307 3rd Ave W. Seattle, WA 98119", location:"{ 'LAT': '47.35124', 'LON': '124.1265' }", desc:"This is a test restaurant. Does not really exist.", website:"sample.com", menu:"sample.com/menu", green: true, local: true, ownership: true, vegan: true, aca: true});`
- `> db.rest.insert({ name : "WEST Restaurant", phone : "(206) 421-1061", hours: "{'SUN': '9-5', 'MON': '9-5', 'TUE': '9-5', 'WED': '9-5', 'THU': '9-5', 'FRI': '9-5', 'SAT': '9-5'}",pricing:3, rating:3, address:"3307 3rd Ave W. Seattle, WA 98119", location:"{ 'LAT': '47.35124', 'LON': '124.1265' }", desc:"This is a test restaurant. Does not really exist.", website:"sample.com", menu:"sample.com/menu", green: true, local: true, ownership: true, vegan: false, aca: true});`

#### Some good things to know
- `> db.rest.find( { rating: 3 } )`

### Enable remote access to database
- '> sudo vim /etc/mongod.conf
- '> Network
	port: 27017
	#comment out "bind_ip = 127.0.0.1"




> Please use GitHub's [Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) for updating the README
