include version.conf
SHELL=/bin/bash
PHONY=app-build app-up app-down test-build test-up test-down lint view-build view-compile view-compile-minify view-watch xdevkit clean help

.PHONY: $(PHONY)

app-build: init-xdevkit docker-compose-build-app
app-up: docker-compose-up-app
app-down: docker-compose-down-app

test-build: init-xdevkit docker-compose-build-test
test-up: docker-compose-up-test
test-down: docker-compose-down-test

lint: init-xdevkit docker-compose-up-lint
view-build: init-xdevkit docker-compose-build-view
view-compile: docker-compose-up-view-compile
view-compile-minify: docker-compose-up-view-compile-minify
view-watch: docker-compose-up-view-watch

xdevkit: init-xdevkit

clean: app-down test-down

help:
	@echo "Usage: make (app|test)-(build|up|down)"
	@echo "Usage: make (xdevkit|lint|clean)"
	@echo "Usage: make view-(build|compile|compile-minify|watch)"
	@echo "Example:"
	@echo "  make app-build             # Recreate image"
	@echo "  make app-up                # Start server"
	@echo "  make app-down              # Clean app container/volume"
	@echo "------------------------------"
	@echo "  make test-build            # Recreate test image"
	@echo "  make test-up               # Start test"
	@echo "  make test-down             # Clean test container/volume"
	@echo "------------------------------"
	@echo "------------------------------"
	@echo "  make view-build            # build view compiler image"
	@echo "  make view-compile          # compile"
	@echo "  make view-compile-minify   # compile minify"
	@echo "  make view-watch            # watch"
	@echo "  make xdevkit               # Update xdevkit only"
	@echo "------------------------------"
	@echo "  make lint     		          # lint"
	@echo "------------------------------"
	@echo "  make clean                 # Clean app, test container/volume"


# init
init-xdevkit:
	git submodule update -i && pushd staticWeb/xdevkit/ && git checkout master && git pull && git checkout $(XDEVKIT_VERSION) && git pull origin $(XDEVKIT_VERSION) && yarn install && popd && cp ./staticWeb/xdevkit/server/browserServerSetting.js ./staticWeb/setting/browserServerSetting.js && cp ./staticWeb/xdevkit/server/browserServerSetting.js ./staticWeb/view/src/js/_setting/browserServerSetting.js && cp -r ./staticWeb/xdevkit/view/src/js/_xdevkit ./staticWeb/view/src/js/_lib/
	git submodule update -i && pushd authApi/xdevkit/ && git checkout master && git pull && git checkout $(XDEVKIT_VERSION) && git pull origin $(XDEVKIT_VERSION) && yarn install && popd && cp ./authApi/xdevkit/server/browserServerSetting.js ./authApi/setting/browserServerSetting.js
	git submodule update -i && pushd storageApi/xdevkit/ && git checkout master && git pull && git checkout $(XDEVKIT_VERSION) && git pull origin $(XDEVKIT_VERSION) && yarn install && popd && cp ./storageApi/xdevkit/server/browserServerSetting.js ./storageApi/setting/browserServerSetting.js

# build
docker-compose-build-app:
	docker compose -p xlogin-jp-app -f ./docker/docker-compose.app.yml build
docker-compose-build-test:
	docker compose -p xlogin-jp-test -f ./docker/docker-compose.test.yml build
docker-compose-build-view:
	docker compose -p xlogin-jp-view -f ./docker/docker-compose.view.yml build

# up
docker-compose-up-app:
	docker compose -p xlogin-jp-app -f ./docker/docker-compose.app.yml up
docker-compose-up-test:
	docker compose -p xlogin-jp-test -f ./docker/docker-compose.test.yml down
	docker volume rm xlogin-jp-test_xltest-volume-pc-psql
	docker volume rm xlogin-jp-test_xltest-volume-rc-redis
	docker compose -p xlogin-jp-test -f ./docker/docker-compose.test.yml up --abort-on-container-exit

docker-compose-up-lint:
	docker compose -p xlogin-jp-lint -f ./docker/docker-compose.lint.yml up --abort-on-container-exit
docker-compose-up-view-compile:
	BUILD_COMMAND="compile" docker compose -p xlogin-jp-view -f ./docker/docker-compose.view.yml up --abort-on-container-exit
docker-compose-up-view-compile-minify:
	BUILD_COMMAND="compile-minify" docker compose -p xlogin-jp-view -f ./docker/docker-compose.view.yml up --abort-on-container-exit
docker-compose-up-view-watch:
	BUILD_COMMAND="watch" docker compose -p xlogin-jp-view -f ./docker/docker-compose.view.yml up --abort-on-container-exit

# down
docker-compose-down-app:
	docker compose -p xlogin-jp-app -f ./docker/docker-compose.app.yml down --volumes
docker-compose-down-test:
	docker compose -p xlogin-jp-test -f ./docker/docker-compose.test.yml down --volumes

%:
	@echo "Target '$@' does not exist."
	@make -s help

