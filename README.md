# Software Engineering Project
This is the git Repository for the Savour and Sip app, created for the computer science senior project class, Software Engineering.
The project was built by [Matt G. Hall](githubb.com/mattghall), [Brandon Duncan](githubb.com/brandondunc94), and [Gino Sahagun](GinoSahagun).

## Environment
Instructions for setting up your dev environment
- [Install Node.js (32 bit)](https://nodejs.org/en/download/)
- [Install Node.js Tools for Visual Studio](https://www.visualstudio.com/vs/node-js/)
- Pull the Savour Git repo and open the Visual Studio project
- Missing Node Packages? Under Solution Explorer, right click `npm` and select "Install Missing npm Packages"

## Database
Get data in your local database - please use camel case for table and key names
- `> mongod.exe` _starts a local instance of mongoDB_
- `> use savour` _Creates Savour database_
- `> db.rest.insert({ name : 'Curbside', location : 'Queen Anne', ...});` _Restaurant collection is created_
- `> show collections` _to view the created collections/tables_
- `> db.rest.find({})` _List all elements in Restaurant collection_

#### Sample insert
```shell
db.rest.insert({
    "name" : "Pho Cyclo Cafe",
    "location" : {
        "LON" : "-122.34195249999999",
        "LAT" : "47.62726010000001"
    },
    "phone" : "(206) 284-2897",
    "hours" : {
        "SAT" : "11:00 AM-8:00 PM",
        "FRI" : "11:00 AM-8:00 PM",
        "THU" : "11:00 AM-8:00 PM",
        "WED" : "11:00 AM-8:00 PM",
        "TUE" : "11:00 AM-8:00 PM",
        "MON" : "11:00 AM-8:00 PM",
        "SUN" : "11:00 AM-8:00 PM"
    },
    "filters" : {
        "disability-friendly" : "0",
        "vegan-friendly" : "1",
        "locally-sourced" : "0",
        "environmentally-friendly" : "0",
        "minority-owned" : "1",
        "locally-owned" : "0"
    },
    "type" : "restaurant",
    "pricing" : 2,
    "rating" : 4.33333333333333,
    "address" : "900 Dexter Ave N, Seattle, WA 98109, USA",
    "desc" : "Vietnamese quick bites",
    "website" : "http://phocyclocafe.com",
    "menu" : "http://places.singleplatform.com",
    "__v" : 0,
    "id" : "58e681746cf2d01230089854",
    "image" : "https://res.cloudinary.com/savoursip/image/upload/v1492668367/q5bchtd8hhqjidmhmfgu.jpg (65kB)
"
})
```
#### Sample 2
```shell
db.rest.insert({
    "name" : "Flying Apron",
    "location" : {
        "LON" : "-122.3496414",
        "LAT" : "47.6509795"
    },
    "phone" : "(206) 442-1115",
    "hours" : {
        "SAT" : "7:30 AM-7:00 PM",
        "FRI" : "7:30 AM-7:00 PM",
        "THU" : "7:30 AM-7:00 PM",
        "WED" : "7:30 AM-7:00 PM",
        "TUE" : "7:30 AM-7:00 PM",
        "MON" : "7:30 AM-7:00 PM",
        "SUN" : "7:30 AM-7:00 PM"
    },
    "filters" : {
        "disability-friendly" : "1",
        "vegan-friendly" : "1",
        "locally-sourced" : "1",
        "environmentally-friendly" : "1",
        "minority-owned" : "0",
        "locally-owned" : "1"
    },
    "type" : "cafe",
    "pricing" : 3,
    "rating" : 4.66666666666667,
    "address" : "3510 Fremont Ave N, Seattle, WA 98103, USA",
    "desc" : "Bake shop for gluten-free sweets like cupcakes & cookies plus savories like bread, pizza & lasagna.",
    "website" : "http://flyingapron.com",
    "menu" : "http://places.singleplatform.com/flying-apron-baking-co/menu?ref=google",
    "image" : "https://res.cloudinary.com/savoursip/image/upload/v1490907411/tj0dbndsl5lgrdcbenl3.jpg (206kB)
",
    "__v" : 0,
    "id" : "58dd71a14963d12efcf0b927"
})
```

## Server
Follow these instruction to set up server
- [Set up Digital Ocean Node JS Machine.](https://cloud.digitalocean.com/support/suggestions?article=initial-server-setup-with-ubuntu-14-04&i=bbf02d&page=0&query=ubuntu%20setup)
- [Connect To Droplet with SSH.](https://www.digitalocean.com/community/tutorials/how-to-use-ssh-keys-with-putty-on-digitalocean-droplets-windows-users) Essentially this just requires creating a new public/private key with PuTTY, saving the public key to the server, then saving the private key in PuTTY.
- [Install mongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

When installing packages on the server, please list them here
```shell
npm install blueimp-file-upload
npm install body-parser
npm install cloudinary-jquery-file-upload
npm install debug
npm install express
npm install mongodb
npm install mongoose
npm install morgan
npm install toastr
```

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

#### Some good things to know
- `> db.rest.find( { rating: 3 } )`

### Enable remote access to database
- '> sudo vim /etc/mongod.conf
- '> Network
	port: 27017
	#comment out "bind_ip = 127.0.0.1"
	
## Renewing SSL Certificate
-`> sudo service nginx stop`
-`> sudo certbot renew`
-`> sudo service nginx start`




> Please use GitHub's [Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) for updating the README
