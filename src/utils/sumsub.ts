import fs from "fs";
import https from "https";
import FormData from "form-data";
import { UploadDocumentOptions } from "../types/user.types";
import crypto from "crypto";
import { URL } from "url";

export const SUMSUB_BASE_URL = process.env.SUMSUB_BASE_URL!;
export const SUMSUB_APP_TOKEN = process.env.SUMSUB_APP_TOKEN!;
export const SUMSUB_APP_SECRET = process.env.SUMSUB_SECRET_KEY!;
const SUMSUB_ENABLED = process.env.SUMSUB_ENABLED === "true";

const httpsRequest = (
  urlStr: string,
  options: https.RequestOptions,
  body?: any
): Promise<any> => {
  const url = new URL(urlStr);
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: options.method,
        headers: options.headers,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              resolve(data);
            }
          } else {
            reject(new Error(`Request failed: ${res.statusCode} ${data}`));
          }
        });
      }
    );

    req.on("error", (err) => reject(err));
    if (body) {
      if (typeof body === "string" || Buffer.isBuffer(body)) {
        req.write(body);
      } else {
        body.pipe(req);
      }
    }
    req.end();
  });
};

export const createSumsubApplicant = async (userId: string) => {
  if (!SUMSUB_ENABLED) {
    console.log("[Sumsub Disabled] createSumsubApplicant skipped");
    return;
  }

  const payload = JSON.stringify({ externalUserId: userId });
  return httpsRequest(
    `${SUMSUB_BASE_URL}/resources/applicants`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-App-Token": SUMSUB_APP_TOKEN,
        "Content-Length": Buffer.byteLength(payload),
      },
    },
    payload
  );
};

export const generateSumsubAccessToken = async (userId: string) => {
  if (!SUMSUB_ENABLED) {
    console.log("[Sumsub Disabled] generateSumsubAccessToken skipped");
    return;
  }

  return httpsRequest(
    `${SUMSUB_BASE_URL}/resources/accessTokens?userId=${userId}`,
    {
      method: "POST",
      headers: {
        "X-App-Token": SUMSUB_APP_TOKEN,
      },
    }
  );
};

export const registerSumsubWebhook = async (webhookUrl: string) => {
  if (!SUMSUB_ENABLED) {
    console.log("[Sumsub Disabled] registerSumsubWebhook skipped");
    return;
  }

  const payloadObj = {
    url: webhookUrl,
    events: ["applicant.statusChanged"],
  };
  const payload = JSON.stringify(payloadObj);
  const ts = `${Math.floor(Date.now() / 1000)}`;
  const signature = generateSignature(payloadObj);

  return httpsRequest(
    `${SUMSUB_BASE_URL}/resources/webhookConfigs`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-App-Token": SUMSUB_APP_TOKEN,
        "X-App-Access-Sig": signature,
        "X-App-Access-Ts": ts,
        "Content-Length": Buffer.byteLength(payload),
      },
    },
    payload
  );
};

export const uploadDocumentToSumsub = async (
  options: UploadDocumentOptions
) => {
  if (!SUMSUB_ENABLED) {
    console.log("[Sumsub Disabled] uploadDocumentToSumsub skipped");
    return;
  }

  const form = new FormData();
  form.append(
    "metadata",
    JSON.stringify({
      idDocType: options.documentType,
      country: options.country,
      docSide: options.side,
    })
  );
  form.append(
    "content",
    fs.createReadStream(options.filePath),
    options.fileName
  );

  const headers = form.getHeaders();
  headers["X-App-Token"] = SUMSUB_APP_TOKEN;

  return httpsRequest(
    `${SUMSUB_BASE_URL}/resources/applicants/${options.applicantId}/info/idDoc`,
    {
      method: "POST",
      headers,
    },
    form
  );
};

export const generateSignature = (body: any): string => {
  const ts = Math.floor(Date.now() / 1000).toString();
  const bodyStr = JSON.stringify(body);
  return crypto
    .createHmac("sha256", SUMSUB_APP_SECRET)
    .update(ts + bodyStr)
    .digest("hex");
};
