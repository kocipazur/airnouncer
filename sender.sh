#!/bin/sh
#
#  This script sends whatever is piped to it as a message to the specified Telegram bot
#
message=$( cat )
apiToken='252407594:AAFOsNOUFNQi11amasd6WUtEWNP45268r1k'
# example:
# apiToken=123456789:AbCdEfgijk1LmPQRSTu234v5Wx-yZA67BCD
userChatId=78643009
# example:
# userChatId=123456789

sendTelegram() {
        curl -s \
        -X POST \
        https://api.telegram.org/bot$apiToken/sendMessage \
        -d text="$message" \
        -d chat_id=$userChatId
}

if  [[ -z "$message" ]]; then
        echo "Please p ipe a message to me!"
else
        sendTelegram
fi
