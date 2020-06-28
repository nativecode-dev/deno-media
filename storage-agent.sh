#!/bin/bash

export DEBUG=*
deno run -A -c tsconfig.json --unstable run.ts storage-agent
