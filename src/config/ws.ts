// @ts-ignore
import http from "http";
import { parse } from "url";
import { WebSocket, WebSocketServer } from "ws";
import { log } from "../utils/logger";
import {
  kafka_topics,
  messages,
  polygon_actions,
  polygon_response_types,
  ws_request_types,
  ws_response_types,
} from "../utils/consts";
import { extractSignature } from "../utils/auth";
import {
  addConsumerToTopic,
  publishMessage,
  destroyTopic,
} from "../utils/pub_sub";
import env from "./config";
import { placeOrderService, evaluateOrder } from "../services/wallet.service";
import { getTickerHistory } from "../services/options.service";
import {
  updateAffiliateDashboard,
  updateAffiliateRevenueShare,
  updateAffiliateSubAffiliate,
  updateAffiliateTurnoverShare,
} from "../services/Affiliate/AffiliateDashboardOverview.Service";
import { handleWsAuth } from "../utils/wsAuth";
import { updateTopAffiliates } from "../services/Affiliate/TopAffiliate.Service";

declare module "ws" {
  interface WebSocket {
    userId?: string;
  }
}

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  authData: { accessToken: string; refreshToken: string } | null;
}

const connections: Map<string, WebSocket> = new Map();
let wss: any;

export const initWs = (server: http.Server) => {
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws: WebSocket, req: http.IncomingMessage) => {
    const { pathname } = parse(req.url || "");

    if (pathname === "/") {
      log("info", "🔌 Connected to /");
      handleNewConnections(ws);

      setTimeout(() => {
        connectToPolygon();
      }, 5000);
    } else if (pathname === "/affiliate") {
      log("info", "🔌 Affiliate WebSocket connection");

      // Track connection state in an object
      const connectionState = {
        isAuthenticated: false,
        userId: null as string | null,
        authData: null as { accessToken: string; refreshToken: string } | null,
      };

      ws.on("message", async (msg) => {
        try {
          const data = JSON.parse(msg.toString());
          console.log("Received message:", data.type);

          // Handle authentication first
          if (data.type === "AUTH") {
            console.log("Processing AUTH message");
            const { accessToken, refreshToken } = data;

            const authResult = await handleWsAuth(accessToken, refreshToken);

            if (!authResult.success || !authResult.user?.id) {
              ws.send(
                JSON.stringify({
                  type: "AUTH_FAILED",
                  reason: authResult.message || "Authentication failed",
                })
              );
              ws.close(4001, "Unauthorized");
              return;
            }

            connectionState.userId = authResult.user.id;
            connectionState.authData = {
              accessToken: authResult.newAccessToken || accessToken,
              refreshToken: authResult.refreshToken || refreshToken,
            };
            connectionState.isAuthenticated = true;

            connections.set(connectionState.userId!, ws);

            console.log({ connectionState });
            ws.send(
              JSON.stringify({
                type: "AUTH_SUCCESS",
                user: authResult.user,
                accessToken: authResult.newAccessToken,
                refreshToken: authResult.refreshToken,
              })
            );

            console.log(
              "Authentication successful for user:",
              connectionState.userId
            );
            log(
              "info",
              `✅ User ${connectionState.userId} authenticated and connected`
            );
            return;
          }

          console.log("Current auth state:", {
            isAuthenticated: connectionState.isAuthenticated,
            userId: connectionState.userId,
            hasAuthData: !!connectionState.authData,
          });

          // For all other message types, check authentication first
          if (
            !connectionState.isAuthenticated ||
            !connectionState.userId ||
            !connectionState.authData
          ) {
            console.log("Sending AUTH_REQUIRED because:", {
              isAuthenticated: connectionState.isAuthenticated,
              hasUserId: !!connectionState.userId,
              hasAuthData: !!connectionState.authData,
            });
            ws.send(
              JSON.stringify({
                type: "AUTH_REQUIRED",
                error: "Not authenticated. Send AUTH message first.",
              })
            );
            return;
          }

          // Handle different types of affiliate update requests
          log("info", { data });
          await handleAuthenticatedAffiliateMessage(ws, data, connectionState);
        } catch (e: any) {
          console.error("❌ Error handling message", e);
          ws.send(
            JSON.stringify({
              type: "ERROR",
              error: "Malformed request",
              details: e.message,
            })
          );
        }
      });

      ws.on("close", () => {
        if (connectionState.userId) {
          log("info", `❌ User ${connectionState.userId} disconnected`);
          connections.delete(connectionState.userId);
        }
      });

      ws.on("error", (error) => {
        console.error("WebSocket error:", error);
        if (connectionState.userId) {
          log(
            "error",
            `WebSocket error for user ${connectionState.userId}: ${error}`
          );
        }
      });
    }
  });

  log("info", "Unified WebSocket server initialized");
};

export const handleAuthenticatedAffiliateMessage = async (
  ws: WebSocket,
  data: any,
  state: AuthState
) => {
  const { userId, authData } = state;

  if (!state.isAuthenticated || !userId || !authData) {
    ws.send(
      JSON.stringify({
        type: "AUTH_REQUIRED",
        error: "Not authenticated. Send AUTH message first.",
      })
    );
    return;
  }

  try {
    switch (data.type) {
      case ws_request_types.affiliate_top_affiliates:
        await updateTopAffiliates(userId, authData);
        log("info", `Top Affiliate update sent to user ${userId}`);
        break;

      case ws_request_types.affiliate_activities:
        await updateAffiliateDashboard(userId, authData);
        log("info", `Dashboard update sent to user ${userId}`);
        break;

      case ws_request_types.affiliate_revenue_share:
        await updateAffiliateRevenueShare(userId, authData);
        log("info", `Revenue share update sent to user ${userId}`);
        break;

      case ws_request_types.affiliate_turnover_share:
        await updateAffiliateTurnoverShare(userId, authData);
        log("info", `Turnover share update sent to user ${userId}`);
        break;

      case ws_request_types.affiliate_sub_affiliate:
        await updateAffiliateSubAffiliate(userId, authData);
        log("info", `Sub-affiliate update sent to user ${userId}`);
        break;

      default:
        ws.send(JSON.stringify({ error: "Unknown request type" }));
    }
  } catch (error: any) {
    console.error("❌ Error processing authenticated message", error);
    ws.send(
      JSON.stringify({
        type: "ERROR",
        error: "Failed to process message",
        details: error.message,
      })
    );
  }
};

const sendToUser = (userId: string, type: string, data: any) => {
  const socket = connections.get(userId);
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type, ...data }));
    log("info", `✅ Sent ${type} update to user ${userId}`);
  } else {
    log("error", `❌ User ${userId} not connected for ${type} update.`);
  }
};

export const PushUpdateToAffiliateDashboardOverview = (
  userId: string,
  data: any
) => sendToUser(userId, ws_response_types.affiliate_activity, data);

export const PushUpdateToAffiliateRevenueShareOverview = (
  userId: string,
  data: any
) => sendToUser(userId, ws_response_types.affiliate_revenue_share, data);

export const PushUpdateToTopAffiliates = (userId: string, data: any) =>
  sendToUser(userId, ws_response_types.affiliate_top_affiliates, data);

export const PushUpdateToAffiliateTurnoverShareOverview = (
  userId: string,
  data: any
) => sendToUser(userId, ws_response_types.affiliate_turnover_share, data);

export const PushUpdateToAffiliateSubAffiliateOverview = (
  userId: string,
  data: any
) => sendToUser(userId, ws_response_types.affiliate_sub_affiliate, data);

export const broadcast = (data: any) => {
  if (!wss) {
    console.error("Websocket Server not initialized");
    return;
  }

  const message = JSON.stringify(data);
  wss.clients.forEach((client: any) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
};

export const connectToPolygon = async (): Promise<void> => {
  if (env.NODE_ENV !== "development") {
    const socket = new WebSocket(env.POLYGON_SOCKET);

    socket.on("open", () => {
      log("info", "Polygon Initialized");

      socket.on("message", async (message: any) => {
        await handlePolygonMessage(socket, message.toString());
      });
    });

    socket.on("close", async () => {
      connectToPolygon();
    });

    socket.on("error", (error: any) => {
      console.log(error);
      connectToPolygon();
    });
  }
};

export const processConsumerMessage = (
  consumer: any,
  connection: any
): void => {
  consumer.run({
    eachMessage: async ({ message }: any) => {
      const messageData = JSON.parse(message.value.toString());
      console.log("Processing activity:", messageData);

      connection.send(
        JSON.stringify({
          type: ws_response_types.affiliate_activity,
          data: messageData,
        }),
        "utf-8"
      );
    },
  });
};

const handlePolygonMessage = async (
  socket: WebSocket,
  message: any
): Promise<void> => {
  message = JSON.parse(message);

  switch (message[0].status) {
    case polygon_response_types.connected:
      socket.send(
        JSON.stringify({
          action: polygon_actions.auth,
          params: env.POLYGON_API_KEY,
        })
      );
      break;
    case polygon_response_types.auth_timeout:
      connectToPolygon();
      break;
    case polygon_response_types.auth_failed:
      connectToPolygon();
      break;
    case polygon_response_types.authed:
      socket.send(
        JSON.stringify({
          action: polygon_actions.subscribe,
          params: "XAS.*",
          ticker: "*",
        })
      );
      break;
    default:
      break;
  }

  if (message[0].ev == "XAS") {
    for (let i = 0; i < message.length; i++) {
      await publishMessage(kafka_topics.options, JSON.stringify(message[i]));
    }
  }
};

const handleNewConnections = (connection: any): void => {
  connection.authed = false;
  connection.user_id = null;

  connection.on("message", async (message: any) => {
    message = message.toString();
    let data: any;
    try {
      data = JSON.parse(message);
    } catch (error) {
      log("error", { error });
      return;
    }

    connections.set(data.user_id, connection);

    switch (data.type) {
      case ws_request_types.auth:
        console.log(data);
        try {
          connection.user_id = extractSignature(data.data).user_id;
          connection.authed = true;
          connection.current_ticker = null;
          connection.send(
            JSON.stringify({
              type: ws_response_types.authed,
              data: messages.OK,
            }),
            "utf-8"
          );
        } catch (error) {
          connection.close();
        }
        break;
      case ws_request_types.subscribe:
        let ticker = data.data.ticker;
        connection.current_ticker = ticker;
        connection.consumer_id = `${
          connection.user_id
        }-${new Date().getTime()}`;
        connection.consumer = await addConsumerToTopic(
          kafka_topics.options,
          connection.consumer_id
        );

        try {
          let history = await getTickerHistory(connection.current_ticker);
          connection.send(
            JSON.stringify({
              type: ws_response_types.ticker_subscription_history,
              data: history,
            }),
            "utf-8"
          );
        } catch (error: any) {
          console.log(error);
        }

        await connection.consumer.run({
          eachMessage: async ({ message }: any) => {
            let options_data = JSON.parse(message.value.toString());
            if (options_data.pair == connection.current_ticker) {
              connection.send(
                JSON.stringify({
                  type: ws_response_types.options,
                  data: options_data,
                }),
                "utf-8"
              );
            }
          },
        });
        connection.send(
          JSON.stringify({
            type: ws_response_types.subscribed,
            data: `Subscribed to ticker ${connection.current_ticker}`,
          }),
          "utf-8"
        );
        break;
      case ws_request_types.place_order:
        let order: any;
        let wallet: any;
        let transaction_: any;
        let user_id = connection.user_id;

        try {
          let order_data = (
            await placeOrderService(data.data, connection.user_id)
          ).body;
          order = order_data.order;
          wallet = order_data.wallet;
          transaction_ = order_data.transaction;
        } catch (error: any) {
          console.log(error);
          log("error", { error });
          return connection.send(
            JSON.stringify({
              type: ws_response_types.order_failed,
              data: error.message,
            }),
            "utf-8"
          );
        }

        let topic_name = `${kafka_topics.evaluate_contract}-${user_id}-${order.id}-${transaction_.id}-${wallet.id}`;

        await publishMessage(
          topic_name,
          JSON.stringify({
            user_id,
            wallet_id: wallet.id,
            order_id: order.id,
            transaction_id: transaction_.id,
          }),
          new Date(new Date(data.data.expiration).getTime())
        );

        connection.send(
          JSON.stringify({
            type: ws_response_types.order_placed,
            data: messages.ORDER_PLACED,
          }),
          "utf-8"
        );

        let consumer = await addConsumerToTopic(topic_name, topic_name, true);
        consumer.run({
          eachMessage: async ({ message }: any): Promise<void> => {
            let timestamp = JSON.parse(message.timestamp);
            message = JSON.parse(message.value.toString());

            let expirationTime = new Date(timestamp);
            let expirationUnix = expirationTime.getTime();
            let nowUnix = new Date().getTime();
            let data = message;

            if (nowUnix >= expirationUnix) {
              await evaluateOrder(
                data.wallet_id,
                data.user_id,
                data.transaction_id,
                data.order_id,
                expirationUnix
              );
              await consumer.stop();
              await consumer.disconnect();
              connection.send(
                JSON.stringify({
                  type: ws_response_types.order_rewarded,
                  data: messages.ORDER_REWARDED,
                }),
                "utf-8"
              );
              await destroyTopic(topic_name);
            } else {
              setTimeout(async () => {
                await evaluateOrder(
                  data.wallet_id,
                  data.user_id,
                  data.transaction_id,
                  data.order_id,
                  expirationUnix
                );
                await consumer.stop();
                await consumer.disconnect();
                connection.send(
                  JSON.stringify({
                    type: ws_response_types.order_rewarded,
                    data: messages.ORDER_REWARDED,
                  }),
                  "utf-8"
                );
                await destroyTopic(topic_name);
              }, expirationUnix - nowUnix);
            }
          },
        });
        break;
      default:
        break;
    }
  });

  connection.on("close", async () => {
    if (connection.user_id) {
      connections.delete(connection.user_id);
    }
  });
};
