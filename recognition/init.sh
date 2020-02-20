#!/bin/bash

sudo apt update
sudo apt upgrade -y

sudo pip3 install cmake
sudo pip3 install face_recognition
sudo pip3 install imutils
sudo pip3 install opencv-python
sudo pip3 install opencv-python-headless

sudo apt install -y libatlas-base-dev
sudo apt install -y libjasper-dev
sudo apt install -y libqtgui4
sudo apt install -y python3-pyqt5
sudo apt install -y libhdf5-dev
sudo apt install -y libqt4-test

# https://github.com/amymcgovern/pyparrot/issues/34
