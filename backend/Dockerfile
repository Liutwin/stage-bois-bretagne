FROM denoland/deno:2.7.12
WORKDIR /app
COPY . .
RUN deno cache src/main.ts
EXPOSE 8000
CMD ["deno", "run", "--allow-net", "--allow-read", "--allow-write", "--allow-env", "src/main.ts"]

