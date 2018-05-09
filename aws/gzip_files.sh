find ./public \( -iname '*.html' -o -iname '*.css' -o -iname '*.js' -o -iname '*.json' \) -exec gzip -9 -n {} \; -exec mv {}.gz {} \;
