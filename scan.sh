#!/bin/bash

SRC_DIR=~/rpi-rek/src

IMAGE=${SRC_DIR}/captures/images/image.jpg

# raspi still
raspistill -w 960 -h 720 -t 900 -th none -x none -o ${IMAGE}

# zbar img
zbarimg ${IMAGE} 2>&1 | grep 'QR-Code' > ${SRC_DIR}/static/qr.json

# QR=$(zbarimg ${IMAGE} 2>&1 | grep 'QR-Code')
# echo ${QR:8} > ${SRC_DIR}/static/qr.json
