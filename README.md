# sabour
<h1>Software Engineering Project</h1>

<h3>Server</h3>
<sub> When installing packages on the server, please list them here</sub>
<ul>
  <li><a href="https://cloud.digitalocean.com/support/suggestions?article=initial-server-setup-with-ubuntu-14-04&i=bbf02d&page=0&query=ubuntu%20setup">Set up Digital Ocean Node JS Machine.</a></li>
  <li><a href="https://www.digitalocean.com/community/tutorials/how-to-use-ssh-keys-with-putty-on-digitalocean-droplets-windows-users">Connect To Droplet with SSH.</a> Essentially this just requires creating a new public/private key with PuTTY, saving the public key to the server, then saving the private key in PuTTY. </li>

</ul>
<h3>Enviornment </h3>
<ul>
<li><a href="https://nodejs.org/en/download/">Install Node.js (32 bit)</a></li>
<li><a href="https://www.visualstudio.com/vs/node-js/">Install Node.js Tools for Visual Studio</a></li>
<li>Pull the Savour Git repo and open the Visual Studio project</li>
</ul>


<h3>Deploy to server</h3>
<ol>
  <li>Pull the savour-dep Repo</li>
  <li>In Visual Studio, right click on the project, and click <i>Publish</i></li>
  <li>Create New Custom Profile</li>
  <li>Publish method: File System</li>
  <li>Set the target location as the source dir of the dep repo</li>
  <li>Keep Defaults in Settings</li>
  <li>Publish</li>
  <li>Push changes to savour-deployment</li>
</ol>

<h3>Get data in your database</h3>
<ol>
  <li>Run mongod.exe, then open new command prompt, run mongo.exe</li>
  <li> -> Use Savour //Creates Savour database</li>
  <li>-> db.Restaurant.insert({ name : 'Curbside', location : 'Queen Anne'}); //Restaurant collection is created, only using two properties for testing</li>
  <li>-> show collections //to view the created collections</li>
  <li>-> db.Restaurant.find({}) //List all elements in Restaurant collection, should list 'curbside' at this point</li>
  <li>-> db.Restaurant.insert({ name : '', location : ''}); //Repeat to add more restaurants</li>
</ol>
