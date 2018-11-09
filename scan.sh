#!/bin/bash

SRC_DIR=~/rpi-rek/src

IMAGE=${SRC_DIR}/static/image.jpg

# raspi still
raspistill -w 800 -h 600 -t 900 -th none -x none -o ${IMAGE}

# qr
# zbarimg ${IMAGE} 2>&1 | grep 'QR-Code' > ${SRC_DIR}/static/qr.json

PREV=$(cat ${SRC_DIR}/static/qr.json)
if [ -z ${PREV} ]; then
    PREV="{}"
fi

ZBAR=$(zbarimg ${IMAGE} 2>&1 | grep 'QR-Code')
if [ ! -z ${ZBAR} ]; then
    DETC="${ZBAR:8}"
else
    DETC="{}"
fi

if [ "${PREV}" != "${DETC}" ]; then
    echo "${DETC}" > ${SRC_DIR}/static/qr.json
fi
