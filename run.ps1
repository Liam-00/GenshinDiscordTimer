echo "Running Bot..."

push-location (Split-Path $MyInvocation.MyCommand.Path)

.{npm run start} 1>"./logs/log" 2>"./logs/log_error"

pop-location

echo "...bot finished."