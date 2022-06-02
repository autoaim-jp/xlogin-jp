#! /bin/bash

curl -b "sid=${1}; path=/; httpOnly=true;" "http://127.0.0.1:3000/api/v0.2/auth/code?client_id=foo&state=abcde&code=deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef&code_verifier=code_verifier"

