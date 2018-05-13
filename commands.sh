#!/usr/bin/env bash
set -ex

run(){
	# .envrc file is not added to repo
	. .envrc #export GOOD_READS_API_KEY
	npm start
}

$@
