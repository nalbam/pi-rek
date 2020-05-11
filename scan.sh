#!/bin/bash

SHELL_DIR=$(dirname $0)

IMAGE=${SHELL_DIR}/static/image.jpg

# raspi still
raspistill -w 800 -h 600 -t 900 -th none -x none -o ${IMAGE}

# qr
# zbarimg ${IMAGE} 2>&1 | grep 'QR-Code' > ${SHELL_DIR}/static/qr.json

PREV=$(cat ${SHELL_DIR}/static/qr.json)
if [ -z ${PREV} ]; then
    PREV="{}"
fi

ZBAR=$(zbarimg ${IMAGE} 2>&1 | grep 'QR-Code')
if [ ! -z ${ZBAR} ]; then
    DETC="${ZBAR:8}"
else
    DETC=""
fi

if [ "${PREV}" != "${DETC}" ]; then
    echo "${DETC}" > ${SHELL_DIR}/static/qr.json
fi
