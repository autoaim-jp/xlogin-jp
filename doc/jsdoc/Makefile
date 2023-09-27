SHELL=/bin/bash
PHONY=copy-container-jsdoc

.PHONY: $(PHONY)

copy-container-jsdoc:
	mkdir -p /root/.ssh/
	cp ../../setting/jsdoc_ssh_config /root/.ssh/config
	rm -rf html/staticWeb
	rm -rf html/authApi
	rm -rf html/storageApi
	cp -r ../../staticWeb/doc/jsdoc/html ./html/staticWeb
	cp -r ../../authApi/doc/jsdoc/html ./html/authApi
	cp -r ../../storageApi/doc/jsdoc/html ./html/storageApi

