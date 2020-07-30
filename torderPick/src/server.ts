import Koa from "koa";
import { config } from "./config";
const app = new Koa();
app.listen(config.port);
console.log(`Server running on port ${config.port}`);