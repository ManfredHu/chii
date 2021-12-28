#!/bin/bash

# run in centos7
npm i

# fethc devtools with init, check https://github.com/ChromeDevTools/devtools-frontend/blob/main/docs/workflows.md
# npm run init:front_end

cd devtools 
rm -rf devtools-frontend
# gclient是谷歌开发的一套跨平台git仓库管理工具，用来将多个git仓库组成一个solution进行管理,该命令用于同步solution的各个仓库
# --with_branch_heads： 除了clone默认refspecs外，还会clone "branch_heads" refspecs;
# gclinet install by depot_tools, 安装文档 https://commondatastorage.googleapis.com/chrome-infra-docs/flat/depot_tools/docs/html/depot_tools_tutorial.html#_setting_up
gclient sync --with_branch_heads --verbose 

cd ../
python3 scripts/apply_all_patches.py patches/config.json

# move front_end dir to public, make sure ../server/middle/router.js to route request
# npm run dev:front_end
cd devtools/devtools-frontend
gn gen out/Default
autoninja -C out/Default # compile devtools

cd ../../
cp -R devtools/devtools-frontend/out/Default/gen/front_end ./public # copy files

# gen ./target/index.js by devlopment
# npm run dev:target
npx webpack --mode=development

echo $PWD
exit 0