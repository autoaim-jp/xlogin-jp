SHELL=/bin/bash
PHONY=default build run help

.PHONY: $(PHONY)

_TARGET:= $(SRC:./src/%=./result/%)
TARGET:= $(_TARGET:%.dot=%.png)

default: run

build: 
	docker build -f ./docker/Dockerfile -t graphviz-jp .

run:
	mkdir -p `dirname $(TARGET)`
	docker run --rm -w /app/ -v ./:/app/ -it graphviz-jp /bin/bash -c "dot -Tpng $(SRC) -o $(TARGET)"
help:
	@echo "Usage: make build"
	@echo "Usage: make run SRC=./src/graph/001_グラフの全体像.dot"
	
