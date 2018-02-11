#!/bin/bash

export PORT=5200

cd ~/www/memory
./bin/memory stop || true
./bin/memory start

