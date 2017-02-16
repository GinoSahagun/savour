# Software Engineering Project

## Server
When installing packages on the server, please list them here
- [Set up Digital Ocean Node JS Machine.](https://cloud.digitalocean.com/support/suggestions?article=initial-server-setup-with-ubuntu-14-04&i=bbf02d&page=0&query=ubuntu%20setup)
- [Connect To Droplet with SSH. Essentially this just requires creating a new public/private key with PuTTY, saving the public key to the server, then saving the private key in PuTTY.](https://www.digitalocean.com/community/tutorials/how-to-use-ssh-keys-with-putty-on-digitalocean-droplets-windows-users)


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


## Get data in your database
- Run mongod.exe, then open new command prompt, run mongo.exe
- `> use Savour` //Creates Savour database
- `> db.Restaurant.insert({ name : 'Curbside', location : 'Queen Anne'});`` //Restaurant collection is created, only using two properties for testing
- `> show collections` //to view the created collections/tables
- `> db.Restaurant.find({})`` //List all elements in Restaurant collection, should list 'curbside' at this point
- `> db.Restaurant.insert({ name : '', location : ''});` //Repeat to add more restaurants


## Please use GitHubs [Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) for updating the README
