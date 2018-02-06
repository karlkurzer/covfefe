#!/bin/sh
### CONDUCT BACKUP
baseDir="data"
projectDir="covfefe"
timeStamp=$(date +%y-%m-%d_%H-%M)

destination="/${baseDir}/${projectDir}/${timeStamp}"

mkdir -p $destination
mongodump -h localhost -d covfefe -u trump -p lo6qaiaekpxpwmfqlsqbvbujpqccunrdcdmwqpe -o $destination

### DELETE OLD BACKUPS
find /$baseDir/$projectDir -type d -mtime +3 -exec rm -rf {} \;

