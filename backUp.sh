#!/bin/sh
DIR=`date +%y-%m-%d`
DEST=~/data/$DIR
mkdir -p $DEST
mongodump -h localhost -d covfefe -u trump -p lo6qaiaekpxpwmfqlsqbvbujpqccunrdcdmwqpe -o $DEST
