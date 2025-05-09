import https from "https";
import { URL } from "url";
import { messages, request_methods } from "./consts";
import { log } from "../utils/logger";
import { StatusCodes } from "http-status-codes";

export const openRequest = async (
  method: request_methods,
  urlStr: string,
  body: any,
  additionalHeaders = {}
): Promise<any> => {
  const url = new URL(urlStr);
  const requestBody =
    body && typeof body !== "string" ? JSON.stringify(body) : body;

  const options: https.RequestOptions = {
    hostname: url.hostname,
    port: url.port || 443,
    path: url.pathname + url.search,
    method,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": requestBody ? Buffer.byteLength(requestBody) : 0,
      ...additionalHeaders,
    },
    timeout: 60000,
  };

  log("info", { message: { url: urlStr, options } });

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        let parsed;
        try {
          parsed = JSON.parse(data);
        } catch {
          parsed = data;
        }

        log("info", { message: { response: parsed } });

        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve(parsed);
        } else {
          reject({
            ok: false,
            status: res.statusCode,
            message:
              typeof parsed === "string"
                ? parsed
                : parsed?.message || messages.NETWORK_ERROR,
          });
        }
      });
    });

    req.on("error", (error) => {
      log("error", { message: { error } });
      reject({
        ok: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: messages.NETWORK_ERROR,
      });
    });

    if (requestBody) {
      req.write(requestBody);
    }

    req.end();
  });
};