#!/bin/bash
npm i

# fethc devtools with init
# npm run init:front_end
cd devtools 
rm -rf devtools-frontend
gclient sync --with_branch_heads --verbose 
cd ../ && python3 scripts/apply_all_patches.py patches/config.json

# move front_end dir to public, make sure ../server/middle/router.js to route request
# npm run dev:front_end
cd devtools/devtools-frontend
gn gen out/Default 
autoninja -C out/Default # compile devtools
lsla shx cp -R out/Default/gen/front_end ../../public # copy files

# gen ./target/index.js by devlopment
# npm run dev:target
webpack --mode=development -w