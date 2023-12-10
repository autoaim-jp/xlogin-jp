#! /bin/bash

dot -Tpng src/${1:-graph}/${2:-001_グラフの全体像}.dot -o result/${1:-graph}_${2:-001_グラフの全体像}.png

