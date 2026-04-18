FROM denoland/deno:2.7.12
WORKDIR /app
COPY . .
RUN deno cache main.ts
EXPOSE 8000
CMD ["deno", "run", "--allow-net", "--allow-read", "--allow-write", "--allow-env", "main.ts"]

