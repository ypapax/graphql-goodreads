#!/usr/bin/env bash
set -ex

prepare(){
	npm init
}

$@
