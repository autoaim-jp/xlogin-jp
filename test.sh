#! /bin/bash

echo > test.log
./run.sh test up & tail test.log -f

