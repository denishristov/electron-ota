<p align="center">
  <img alt="logo" src="https://i.imgur.com/G9DnSSU.png" width="144">
</p>

<h3 align="center">
  electron-ota
</h3>

## Summary

Update service for Electron apps. Provides a real-time solution for updating the app.asar package of an app and monitoring the process through an admin web application.

What differentiates it from the "autoUpdater" module built-it "Electron" is that it only updates the app.asar of an app, without the native modules of "Electron".

This repo serves as a mono repo for the following components:

| Packages            | Version                                                                                                          |
|---------------------|------------------------------------------------------------------------------------------------------------------|
| electron-ota        |                                                                                                                  |
| electron-ota-api    |                                                                                                                  |
| electron-ota-client | [![npm version](https://badge.fury.io/js/electron-ota-client.svg)](https://badge.fury.io/js/electron-ota-client) |
| electron-ota-shared | [![npm version](https://badge.fury.io/js/electron-ota-shared.svg)](https://badge.fury.io/js/electron-ota-shared) |

## Awards and recognition
* Company choice award from <b>VMware</b> at <b>TUES Fest 2019</b>
* Company choice award from <b>TelebidPro</b> at <b>TUES Fest 2019</b>

## Tech Stack:

### Back-end: 
* Node
* Typescript
* Express
* Socket.IO
* AWS S3
* MongoDB

### Front-end:
* React
* Typescript
* MobX
* SASS
* webpack

## Todo: 
* Proper documentation
* Unit tests
* React Native support
* Client targeting
* Redis sessions

## Admin UI Screenshots
![AppPage](https://i.imgur.com/5U7bB8O.jpg)
![VersionPage](https://i.imgur.com/7dNQxkM.jpg)
![VersionModal](https://i.imgur.com/5iHJoWp.png)
