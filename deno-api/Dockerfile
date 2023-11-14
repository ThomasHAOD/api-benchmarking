FROM denoland/deno:1.38.1
EXPOSE 8000
WORKDIR /app
USER deno
COPY . .
RUN deno cache index.ts
RUN mkdir -p /var/tmp/log
CMD ["run", "--allow-all", "index.ts"]
