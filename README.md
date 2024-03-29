# MovieCollection.app (codename: FirebaseOrange)

### Anglar 16, Firebase Cloud Firestore, AngularFire v16

## Setup

This application uses [Firebase](https://firebase.google.com/) and to get it running, you will need to create an account in Firebase, create an "app" there, enable Cloud Firestore, then in the console it will give you a Firebase configuration object. Replace what is in `src/firebase.config.ts` with your own custom config and the rest should work.

## Helpful Links and Documentation

Auth:
https://github.com/angular/angularfire/blob/master/samples/modular/src/app/auth/auth.component.ts

Auth Guard:
https://github.com/angular/angularfire/blob/master/site/src/auth/route-guards.md

Firestore Fuction Reference:
https://firebase.google.com/docs/reference/js/firestore_

Working with Lists of Data (Firestore):
https://firebase.google.com/docs/firestore/quickstart

`collectionData` explained:
https://github.com/angular/angularfire/blob/master/docs/firestore.md

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.4.

## APIs Used

Profanity Filter:
https://api-ninjas.com/api/profanityfilter
Note that this API converts the returned text to lowercase, so it's not useful for censoring. But it is useful for detecting profanity, as it will return "has_profanity": true.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.
