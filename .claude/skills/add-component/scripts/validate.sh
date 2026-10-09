#!/bin/sh
# 対象のTSXファイルからinterface Propsのプロパティ数を数える
file="$1"
count=$(awk '/interface Props/,/^}/' "$file" | grep -cE '^\s*\w+\??:')
if [ "$count" -gt 5 ]; then
  echo "props${count}個を検出、要修正（上限5個）"
  exit 1
fi
echo "props${count}個、OK"
