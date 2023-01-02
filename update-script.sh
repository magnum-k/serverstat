#!/bin/bash
cd /path/to/repository
git pull
npm install
pm2 restart index
