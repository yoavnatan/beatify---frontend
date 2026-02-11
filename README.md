# Beatify App

Modern End-to-end React, node.js, and express responsive application built with Vite.
DB used with mongoDB.

The project is a replica to Spotify web app, and inspired by it. 

This project was built as a final project in Coding Academy course,
By Yoav Natan & Yahav mor. 

<img width="1791" height="1000" alt="image" src="https://github.com/user-attachments/assets/bac9a694-35d5-489c-93aa-c30adfc11b46" />

## **Links**:
- Live: https://beatify-backend-jyvg.onrender.com/
- Backend repository: https://github.com/yahavmor/beatify---backend

## 📦 Project Setup

Frontend:
- npm i
- npm run dev

backend:
- npm i
- npm start

## 🏗️ Project Structure

## 🎨 Components

### Core Components
- `AppHeader` - Multifuncional Search bar and a user login/logout interface.
- `AppFooter` - The player
- `UserMsg` - Toast notifications
- `Library` - A dynemic, resizable component that contains a sortable list where the user can see its playlists    (Liked/Created)
- `Player` - The player is set at the footer, its state is managed in a global store. The user can shuffle, play next/prev or in a loop.
- `SideBar` - A resizable component that shows details about the current song and artists, and the queue playlist.
the user can use drag and drop to change the order in the queue section. 

### Pages
- `StationIndex` - Main index page where all the playlist are shown, by list and by carusesls. 
- `StationDetails` - A page for everyPlaylist where the user can play songs, like or add to the queue/another playlist, the user can search songs inside the component and instancly add a new one to the playlist. 
- `ListeningRoom` - A Shared playlist, users on this page can listen together to songs, add or delete songs drag and drop to change the order of the playlist, all live by using web sockets. 
- `Search` - Search page with artists and songs by the user input. 
- `Browse` - Find playlist by genres. 
- `Chat` - Real-time messaging inside the Shared playlist, using web sockets. 
- `LoginSignup` - Page for authentication. 

## 🔄 State Management

We used Redux with the following modules:
- `playerModule` - Player states.
- `userModule` - Authentication and user data
- `stationModule` - Playlist states.
- `systemModule` - App-wide settings


## 🎯 Services

### REST API Services
- `station.service` - Playlists CRUD operations
- `user.service` - Authentication & user management
- `upload.service` - File uploads

### Utility Services
- `event-bus.service` - Pub/sub messaging
- `socket.service` - WebSocket connection
- `storage.service` - Local storage wrapper
- `util.service` - Common helpers
- `http.service` - Connection to the backend server.

### Additional services:

- `searchMusic.service` - Connection to outsourced api services to import songs and other media.

#####

## 🎨 Styling

Using SCSS modules with:
- CSS Grid for layouts
- Flexbox for component alignment
- CSS Variables for theming
- Responsive breakpoints
- Utility classes

<img width="468" height="887" alt="image" src="https://github.com/user-attachments/assets/2b03b47b-1fc1-4ca3-a9f9-c9e1b4ac06d8" />

