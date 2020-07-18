FROM alpine:3.9
ARG TAG=master
RUN apk add --no-cache nodejs npm git python make g++ yarn
WORKDIR /app
ADD . /app
RUN cd /app && \
  git checkout ${TAG} && \
  yarn install && \
  yarn test:unit && \
  yarn build

FROM nginx:latest
WORKDIR /app
EXPOSE 80
COPY --from=0 /app/docker_config/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=0 /app/dist /app
STOPSIGNAL SIGINT
CMD ["nginx", "-g", "daemon off;"]
