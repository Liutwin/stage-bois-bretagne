import { Application } from "@oak/oak";

const app = new Application();

app.use((ctx) => {
  ctx.response.body = "OK";
});

await app.listen({ port: 8000 });
