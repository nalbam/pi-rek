#!/bin/bash

SRC_DIR=~/rpi-rek/src

IMAGE=${SRC_DIR}/captures/images/image.jpg

# raspi still
raspistill -w 800 -h 600 -t 900 -th none -x none -o ${IMAGE}

# qr
# zbarimg ${IMAGE} 2>&1 | grep 'QR-Code' > ${SRC_DIR}/static/qr.json

PREV=$(cat ${SRC_DIR}/static/qr.json)

QR=$(zbarimg ${IMAGE} 2>&1 | grep 'QR-Code')
if [ ! -z ${QR} ]; then
    DETC="${QR:7}"
fi

if [ "${PREV}" != "${DETC}" ]; then
    echo "${DETC}" > ${SRC_DIR}/static/qr.json
fi
