Use the following command to create a minimal version of the Font Awesome font file:
```
pyftsubset fa-solid-900.ttf --unicodes="1f480,2009,f2bd" --output-file="fa-minimal.woff2" --flavor="woff2" --with-zopfli --no-hinting --no-layout-closure
```