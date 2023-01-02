#!/bin/bash

# Load the config file
source config.sh

# Change to the repository directory
cd $REPO_PATH

# Pull the latest changes from the GitHub repository
git pull

# Install any new dependencies
npm install

# Restart the Discord bot
pm2 restart $BOT_SCRIPT
