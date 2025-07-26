-   [x] We do not want "هلالات" - FIXED: Removed decimal amounts from banking data

-   [x] we need to wait for STT to finish before sending command to LLM - FIXED: Now using final transcript with confidence threshold

-   [x] Command reprocessing bug - FIXED: Clear transcript state and track processed commands to prevent duplicate processing

,

-   Data bug " LOG ✅ Found content in data.output[message].content[0].text
    LOG ⚡ LLM took 3630ms
    LOG 🎵 Playing filler audio: transaction_search
    LOG 🗣️ TTS start: ما عندي بيانات عن الشهر الماضي عشان أقارن لك...
    LOG ✅ TTS generated
    "
