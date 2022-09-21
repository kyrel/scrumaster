# scrumaster
Scrum sprint retrospective tool; assignment from De Voorhoede

## Technologies used

* Vite 3
* Vue 3 (+ Pinia & Router)
* TypeScript
* Firebase (Auth and Realtime Database)
* SCSS
* Vitest
* ESLint, Stylelint / BEM

Hosted at Firebase, but any hosting with redirect support (for SPA style / History API routing to work) will do. No server-side code to execute.
Deploying to Firebase happens upon every merge & pull to the main branch at GitHub via GitHub Actions.
Technology choice mostly driven by the facts that SEO & time to first content do not seem to be on the requirement list (thus no SSR), while rather complex real-time data update is (here the usage of a real-time database seems the easiest approach).

## Accessing the deployed instance

Use ![](https://voorhoede-assignment.firebaseapp.com) to work with the instance of the app deployed at Firebase hosting.

## Running & building

`npm run dev`
to start the application locally. Connection settings are hardcoded, so it works with the same auth service and DB as in production.

`npm run build`
to package the application for production. Can be e.g. deployed manually using the Firebase CLI. Also runs the TypeScript checks

`npm run test:unit`
to run unit tests using Vitest

`npm run lint`
Run the ESLint checks

`npx stylelint "**/*.vue" "**/*.scss"`
Run the Stylelint checks

## Features implemented

* Adding & renaming categories, deleting empty categories (probably would be part of a separate view in a real-life app though, no to clog the main UI)
* Adding tickets to categories, editing tickets, deleting tickets without votes (observing app usage might lead to permitting deleting tickets with votes also)
* Voting for tickets & revoking votes, max 1 vote per user per ticket, max 2 votes per user per category
* Passwordless authentication (by Firebase, signin links sent to email)
* Multiple user support, real-time updates

## Non-functional characteristics

* Responsive layouts, support for touch devices
* Dark color scheme support

## Code quality tools & conventions

* ESLint is mostly set to follow the widest ("recommended") set of rules & conventions for Vue & general TypeScript code
* StyleLink is set to follow the "standard" rule set for CSS/SCSS and BEM conventions
* The unit tests are proof-of-concept only, being not implemented for most of the code
* End-to-end tests not implemented

## Features not implemented from the optional requirement list & other possible further enhancements

* Automatic sorting based on votes
* Timer for disabling further editing
* Sending out the results to participants
* Staring out a new board
* Reordering of categories
* Less intrusive switching to edit mode (e.g. with ticket height changing)

## Questionable decisions redarding UI/UX

* Always-visibile action icons on touch devices (vs. visible on hover on desktop) clog the interface
* Left vs central positioning of categories on board
* Possibly commit ticket creation and update on enter (instead on insering a line feed)