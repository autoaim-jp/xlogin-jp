SHELL=/bin/bash
PHONY=default build run help

.PHONY: $(PHONY)

default: run

build: 
	docker build -f ./docker/Dockerfile -t graphviz-jp .

run:
	@read -p "dir: " GRAPH_DIR; \
	read -p "title: " GRAPH_TITLE; \
	echo ; \
	docker run --rm -w /app/ -v ./:/app/ -it graphviz-jp /bin/bash -c "./run.sh $$GRAPH_DIR $$GRAPH_TITLE"

help:
	@echo "Usage: make build"
	@echo "Usage: make run"
	
