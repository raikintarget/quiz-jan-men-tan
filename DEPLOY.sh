#!/bin/bash
# Жан мен Тән квизін Railway-ге деплой жасау
# Мына команданы Terminal-да іске қосыңыз:

cd "$(dirname "$0")"

echo "🚀 Railway-ге кіру..."
railway login

echo ""
echo "📦 Жаңа Railway жобасын жасау..."
railway init --name "quiz-jan-men-tan"

echo ""
echo "🚢 Деплой жасалуда..."
railway up --detach

echo ""
echo "🌐 Домен алу..."
railway domain

echo ""
echo "✅ Дайын! Жоғарыдағы URL-ді браузерде ашыңыз."
