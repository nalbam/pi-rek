#!/bin/bash

SHELL_DIR=$(dirname $0)

CONFIG=~/.rpi-rek
touch ${CONFIG}
. ${CONFIG}

# raspi still
raspistill -w 960 -h 720 -t 1000 -th none -x none -o ~/rpi-rek/src/captures/images/image.jpg
