include version.conf
SHELL=/bin/bash
PHONY=app-build app-up app-down xdevkit test-build test-up test-down clean help

.PHONY: $(PHONY)

app-up: docker-compose-up-app
app-down: docker-compose-down-app
app-build: init-xdevkit docker-compose-build-app

test-up: docker-compose-up-test
test-build: init-xdevkit docker-compose-build-test
test-down: docker-compose-down-test

xdevkit: init-xdevkit

clean: app-down test-down

help:
	@echo "Usage: make (app|test|xdevkit|clean)-(build|up|down)"
	@echo "Example:"
	@echo "  make app-build    # Recreate image"
	@echo "  make app-up       # Start server"
	@echo "  make app-down     # Clean app container/volume"
	@echo "------------------------------"
	@echo "  make test-build   # Recreate test image"
	@echo "  make test-up      # Start test"
	@echo "  make test-down    # Clean test container/volume"
	@echo "------------------------------"
	@echo "  make xdevkit      # Update xdevkit only"
	@echo "------------------------------"
	@echo "  make clean        # Clean app, test container/volume"


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

# up
docker-compose-up-app:
	docker compose -p xlogin-jp-app -f ./docker/docker-compose.app.yml up
docker-compose-up-test:
	docker compose -p xlogin-jp-test -f ./docker/docker-compose.test.yml up --abort-on-container-exit

# down
docker-compose-down-app:
	docker compose -p xlogin-jp-app -f ./docker/docker-compose.app.yml down --volumes
docker-compose-down-test:
	docker compose -p xlogin-jp-test -f ./docker/docker-compose.test.yml down --volumes


ifeq (,$(filter $(MAKECMDGOALS),$(PHONY)))
    $(error Target not found)
endif

