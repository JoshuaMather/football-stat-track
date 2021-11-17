<h3 align="center">Football Stat Track</h3>
<p align="center">App to manage players and matches with accompanying statistics</p>

## Installation

```bash
git clone https://github.com/JoshuaMather/football-stat-track.git
cd angular-sqlite-app-starter
git remote rm origin
```

 - then install it

```bash
npm install
```

 - then go to the building process

```bash
npm run build
npx cap sync
npm run build
npx cap copy
npx cap copy web
```

the capacitor config parameters are:

```
  "appId": "com.track.stat.football",
  "appName": "football-stat-track",
```

### Building Web Code

```bash
ionic serve
```
- with `jeep-sqlite` installed:
  
  you will be able to run SQLite queries. The sqlite.service.ts has been modified to handle them.
  see [Web Usage documentation](https://github.com/capacitor-community/sqlite/blob/web/docs/Web_Usage.md) 

- without `jeep-sqlite` installed:

```
Not implemented on Web
```


### Building Native Project


#### Android

```bash
npx cap open android

ionic capacitor run android
```
Once Android Studio launches, you can build your app through the standard Android Studio workflow.
If SDK error given after executing command, open the android folder in android studio and build. Then subsequent commands will run the app fine.

### iOS

```bash
npx cap open ios
```

### Building Electron project

```bash
cd electron
npm install
npm run build
cd ..
npx cap sync @capacitor-community/electron
npm run build
npx cap copy @capacitor-community/electron
npx cap open @capacitor-community/electron
```

When your Electron app is tested and you would like to create an executable
either for Mac or for Windows

```bash
cd electron
npm run electron:make
``` 