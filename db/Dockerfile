FROM mongo:4.0.9
VOLUME /data/db
RUN mkdir /opt/db
WORKDIR /opt/db
COPY ./db .
RUN chmod 777 ./restore.sh
ENTRYPOINT ./restore.sh