#!/bin/bash
killall -9 node


# Navigate to the Node.js app folder
cd API

# Install Node.js app dependencies
npm install

# Start the Node.js app
npm run start &

# Return to the root folder
cd ..

# Navigate to the React app folder
cd GUI/react-app

# Install React app dependencies
npm install

# Start the React app
npm run dev &

# Return to the root folder
cd ..
cd ..