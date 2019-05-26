FROM mongo:4.0.9
RUN mkdir /opt/app
WORKDIR /opt/app
COPY ./db ./db
RUN chmod 777 ./db/restore.sh
ENTRYPOINT ./db/restore.sh