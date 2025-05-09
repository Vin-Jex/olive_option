import TelegramBot from "node-telegram-bot-api";
import env from "../../config/config";
import axios from "axios";
import bodyParser from "body-parser";
import express from "express";

const { SERVER_URL, TELEGRAM_BOT_TOKEN } = env;

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, {
  webHook: true,
});

bot.setWebHook(`${SERVER_URL}/bot${TELEGRAM_BOT_TOKEN}`);

export default bot;
