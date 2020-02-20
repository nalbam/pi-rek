#!/bin/bash

sudo apt update
sudo apt upgrade -y

sudo pip3 install cmake
sudo pip3 install face_recognition
sudo pip3 install imutils
sudo pip3 install opencv-python
sudo pip3 install opencv-python-headless
sudo pip3 install opencv-contrib-python

sudo apt install -y libhdf5-dev libatlas-base-dev libjasper-dev libqtgui4 libqt4-test

# https://github.com/amymcgovern/pyparrot/issues/34
