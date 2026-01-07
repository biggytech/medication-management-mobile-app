# Medication Management App - Mobile App

## Supported platforms
- Android 36 or higher

## Requirements

- Node.js 22.14 or higher
- Android SDK:
    - emulator 35.4.9 or higher
    - platform-tools 35.0.2 or higher
    - android-36

## Run the App

1. Prepare `.env` file by using env file example (`.env.example`)
    - The backend server repo: https://github.com/biggytech/medication-management-app-server
2. Install dependencies: `npm install`
3. Start the app: `npm run android` _(this will run the App on Android Emulator or connected Android device)_

### Run with local backend
Run `adb reverse tcp:<PORT> tcp:<PORT>` when running emulator / connected phone, where `PORT` is the port number on your local machine at which the backend runs on.
