// Import Internal Dependencies
import { buildServer } from "./app";

const server = buildServer();
server.listen(
  {
    port: 3001,
    host: "localhost"
  },
  function httpListeningCallback(err, addr) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.info(`Server listening on ${addr}`);
  }
);
