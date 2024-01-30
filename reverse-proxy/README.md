# Reverse Proxy

This folder contains some file binded to an nginx docker container.

It order to work well with ssl, you must place an SSL certificate and key in this folder with the names:

```
ssl.crt
ssl.key
```

The key is private and must never be shared. The certificate is public.

To know more about generating a couple certificate/key, browse [this page](https://certbot.eff.org/instructions)
