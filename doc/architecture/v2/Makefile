SHELL=/bin/bash
PHONY=default build run help

.PHONY: $(PHONY)

_target:= $(src:./src/%=./result/%)
target:= $(_target:%.dot=%.png)

default: run

build: 
	docker build -f ./docker/Dockerfile -t graphviz-jp .

run:
	mkdir -p `dirname $(target)`
	docker run --rm -w /app/ -v ./:/app/ -it graphviz-jp /bin/bash -c "dot -Tpng $(src) -o $(target)"
help:
	@echo "Usage: make build"
	@echo "Usage: make run src=./src/graph/001_グラフの全体像.dot"
	
