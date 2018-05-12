#!/usr/bin/env bash
set -ex

run(){
	. .envrc
	npm start
}

$@
