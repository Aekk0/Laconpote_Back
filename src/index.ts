// Import Internal Dependencies
import { buildServer } from "./app";

const server = buildServer();

server.listen(
  {
    port: !Number.isNaN(Number(process.env.port)) && Number(process.env.port) !== 0 ? 
        Number(process.env.port) : 3001,
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
