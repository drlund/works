#!/bin/bash

files=$(git ls-files)

for i in $files
do
	if [ -f $i ] && [ -x $i ]; then
		echo "arquivo com permissao de execução: $i"
		chmod 0644 $i 
	fi
done
