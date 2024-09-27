// Import Internal Dependencies
import { buildServer } from "./app";

const server = buildServer();

console.log(process.env.port, process.env.PORT, process.env.host);

server.listen(
  {
    port: Number(process.env.PORT)!,
    host: process.env.host ?? "localhost"
  },
  function httpListeningCallback(err, addr) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.info(`Server listening on ${addr}`);
  }
);
