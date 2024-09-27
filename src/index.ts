// Import Internal Dependencies
import { buildServer } from "./app";

const server = buildServer();
server.listen(
  {
    port: Number(process.env.PORT),
    host: process.env.HOST ?? "0.0.0.0"
  },
  function httpListeningCallback(err, addr) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.info(`Server listening on ${addr}`);
  }
);
