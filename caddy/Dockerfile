FROM abiosoft/caddy

VOLUME /root/.caddy
COPY /caddy/Caddyfile /etc/Caddyfile

ENTRYPOINT ["/usr/bin/caddy"]
CMD ["--conf", "/etc/Caddyfile", "--log", "stdout"]
