#!/bin/bash
echo "Running Bot..."
cd $(dirname $0) && npm run start 1>./logs/log 2>./logs/log_error
echo "...bot finished."
