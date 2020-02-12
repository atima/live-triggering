# Live Triggering

Media assets, such as overlay graphics or comments, can make video streaming a unique and engaging experience. Appropriately managing media assets during the live streaming, however, is still difficult for streamers who work alone or in small groups. This project contains experimental interfaces that aim to ease the management of media assets. For more information, please visit our paper at https://doi.org/10.1145/3334480.3383037.

Demo application: https://live-triggering.herokuapp.com
Demonstration video: https://youtu.be/VrbYwSsnuKo

## Prerequisites
1. NodeJS https://nodejs.org/en/
2. Quasar framework:
```bash
npm install -g @quasar/cli
```
3. Application dependencies:
```bash
cd <folder>
npm install
```
4. Put any two video files to src/statics/camera.mp4 and src/statics/game.mp4. These files are used for ease of testing in development mode.

## Start the app in development mode (hot-code reloading, error reporting, etc.)
Please run both server and application. The development mode will not ask for camera and screen sharing.

Start server
```bash
npm start
```

Start application
```bash
quasar dev
```

## Build the app for production
```bash
quasar build
```

The build will be in "dist" folder. Note that you will need a server to run the application. The application use port 3000 to send messages between an application and a controller. If you don't have a server yet, you can do the following steps after the build.

1. Copy "dist" folder to "server" folder.
2. Upload server folder to your web hosting.
3. Install dependencies in the folder on your host and start the server.

```bash
npm install
npm start
```