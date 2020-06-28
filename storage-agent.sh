#!/bin/bash

export DEBUG=*
pm2 save
pm2 start --name storage-agent deno -- run -A -c tsconfig.json --unstable run.ts storage-agent
