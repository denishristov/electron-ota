== restore.sh ==
#!/usr/bin/env bash

# Execute restore in the background after 5s
# https://docs.docker.com/engine/reference/run/#detached--d
sleep 10 && mongorestore --verbose --drop ./db/dump &

# Keep mongod in the foreground, otherwise the container will stop
docker-entrypoint.sh mongod