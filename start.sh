#!/bin/bash

# Navigate to the React app folder
cd GUI

# Install React app dependencies
npm install

# Start the React app
npm start &

# Navigate to the Node.js app folder
cd ../API

# Install Node.js app dependencies
npm install

# Start the Node.js app
npm start &

# Return to the root folder
cd ..
