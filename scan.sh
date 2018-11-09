#!/bin/bash

SRC_DIR=~/rpi-rek/src

IMAGE=${SRC_DIR}/captures/images/image.jpg

# raspi still
raspistill -w 800 -h 600 -t 900 -th none -x none -o ${IMAGE}

# qr
# zbarimg ${IMAGE} 2>&1 | grep 'QR-Code' > ${SRC_DIR}/static/qr.json

QR=$(zbarimg ${IMAGE} 2>&1 | grep 'QR-Code')
if [ ! -z ${QR} ]; then
    echo "${QR:8}" > ${SRC_DIR}/static/qr.json
else
    echo "" > ${SRC_DIR}/static/qr.json
fi
