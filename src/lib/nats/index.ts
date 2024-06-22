import { notify } from "./messages";
import { listenAll } from "./suscriptions";

export const NATSClient = {
  listen: listenAll,
  notify: notify  
};
