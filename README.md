# NW MS-ACS Degree Planner

A degree planner for those earning a Masters in Applied Computer Science
from Northwest Missouri State University using [Dragula](https://github.com/bevacqua/dragula) for drag-and-drop and local storage to save a plan.

## Links

* Repository: <https://github.com/profcase/msacs-planner>
* Project Console: <https://console.firebase.google.com/project/msacs-planner/overview>
* Hosting URL: <https://msacs-planner.firebaseapp.com>

## Prerequisites

* Git version control system
* Chrome web browser

To run locally, you just need the code. Then open index.html in Chrome.

## To Edit, Test, and Deploy

You'll also need:

* [Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb)
* Visual Studio Code for editing
* Basic knowledge of HTML, CSS and JavaScript
* Favicon generator such as [RealFaviconGenerator](https://realfavicongenerator.net/)
* Node is required to deploy to Firebase

## Deploy to Firebase - First Time

1. Create a Firebase account at <https://firebase.google.com/console/>
2. Install the most recent LTS (long-term support) version of Node.js.
3. On Windows, open PowerShell as Administrator in root app folder.
4. Install Firebase tools: npm install -g firebase-tools
5. Login with a Google account: firebase login
6. Initialize your Firebase project (be careful not to overwrite existing content): firebase init
7. At the prompts, select Hosting.
8. Enter . to select current directory for the public assets.
9. Select no when it asks to overwrite index.html.
10. Deploy with: firebase deploy

## Deploy to Firebase - Updates

Once the system has been initiated, to deploy updates, just open Git Bash in root folder and deploy.

```Bash
firebase deploy
```

## Resources

* [HTML5Boilerplate](https://html5boilerplate.com/)
* <http://jsfiddle.net/bsvveen/mrjcpocs/>

## Tasks

* [ ] Add checkbox to each req after completing
* [ ] Enhance styling and fit