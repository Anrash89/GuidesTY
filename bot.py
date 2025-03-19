import os
from dotenv import load_dotenv
from telegram import Update, WebAppInfo, KeyboardButton, ReplyKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

# Загрузка переменных окружения из файла .env
load_dotenv()

# Чтение секретных данных из переменных окружения
BOT_TOKEN = os.getenv("BOT_TOKEN")
BOT_URL = os.getenv("BOT_URL")  # URL вашего веб-приложения

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # Создаем кнопку для открытия Web App
    webapp_btn = KeyboardButton(
        text="Открыть гайды TAIYAN",
        web_app=WebAppInfo(url=BOT_URL)
    )
    keyboard = ReplyKeyboardMarkup([[webapp_btn]], resize_keyboard=True)
    await update.message.reply_text(
        text="Привет! Нажми кнопку, чтобы открыть гайды TAIYAN.",
        reply_markup=keyboard
    )

def main():
    # Использование новой версии python-telegram-bot (v20+)
    app = ApplicationBuilder().token(BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.run_polling()

if __name__ == "__main__":
    main()
