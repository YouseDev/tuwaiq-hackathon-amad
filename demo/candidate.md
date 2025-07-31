Android Bundled 77ms node_modules/expo-router/entry.js (1 module)
LOG ✅ Audio session configured
LOG 🤖 LLM context initialized
LOG 🎤 Voice state changed: {"busy": false, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": false, "voiceState": "idle"}
LOG 🎙️ Button pressed - Current state: idle Busy: false
LOG 🎙️ Button PRESSED (1753923146237)
LOG 🎯 STT: Starting listening session
LOG 🔄 Voice session reset
LOG 🔄 STT Processing = TRUE (1753923146242)
LOG ✅ Started listening
LOG 🎤 Voice state changed: {"busy": false, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": true, "voiceState": "listening"}
LOG ✅ STT engine started
LOG 🎙️ STT engine started listening
LOG 🎤 Voice state changed: {"busy": false, "finalTextLength": 0, "isButtonHeld": false, "isListening": true, "isSTTProcessing": true, "voiceState": "listening"}
LOG 🎙️ STT (FINAL): ابي اسدد فاتوره الكهرباء لو سم...
LOG 🎯 STT: Got final segment, accumulating: ابي اسدد فاتوره الكهرباء لو سم
LOG 📝 Accumulated text: ابي اسدد فاتوره الكهرباء لو سمحت...
LOG 🎯 Final Text Updated: "ابي اسدد فاتوره الكهرباء لو سم..." (1753923151204)
LOG ⏳ STT segment complete, waiting for button release...
LOG 🎤 Voice state changed: {"busy": false, "finalTextLength": 32, "isButtonHeld": false, "isListening": true, "isSTTProcessing": true, "voiceState": "listening"}
LOG 🎙️ Button release event - Current state: listening Hold duration: 5634ms
LOG ✅ Accepting button release
LOG 🎙️ Button RELEASED (1753923151872)
LOG 🎯 STT: Stopping listening session
LOG ✅ Stopped listening
LOG 🎯 Button released - marking STT processing complete
LOG 🔄 STT Processing = FALSE (1753923151876)
LOG 🎤 Voice state changed: {"busy": false, "finalTextLength": 32, "isButtonHeld": false, "isListening": true, "isSTTProcessing": false, "voiceState": "listening"}
LOG 🔄 State changed to processing conditions - triggering checkAndProcess
LOG 🔍 CheckAndProcess called (1753923151896): {"hasText": true, "isButtonHeld": false, "isSTTProcessing": false, "textLength": 32, "textPreview": "ابي اسدد فاتوره الكه"}
LOG ✅ PROCESSING COMMAND: "ابي اسدد فاتوره الكهرباء لو سمحت" (1753923151896)
LOG 🚀 Starting parallel LLM execution
LOG 🧠 SmartLLM System Prompt Length: 7919
LOG 🧠 SmartLLM System Prompt (first 300 chars): You are Echo, a Saudi banking assistant. Help users with banking operations using their data.

# RESPONSE TYPES:

**info** - When user asks about their data (balance, transactions, bills list)

-   Include full details in response text
-   Use Arabic words for numbers in response

**bill_selection** - Wh...
LOG 🧠 SmartLLM System Prompt contains bills data: true
LOG 🧠 SmartLLM Bills section (first 200 chars): Bills: [
{
"id": "bill_001",
"provider": "شركة الكهرباء السعودية",
"type": "كهرباء",
"amount": 286,
"dueDate": "2024-01-20",
"status": "مستحقة",
"accountNumber": "1234567...
LOG 🧠 SmartLLM Conversation History:
LOG user: "ابي اسدد فاتوره الكهرباء لو سمحت"
LOG 🧠 SmartLLM Total Messages: 1
LOG 🧠 SmartLLM Latest User Message: ابي اسدد فاتوره الكهرباء لو سمحت
LOG 🎤 Voice state changed: {"busy": true, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": false, "voiceState": "processing"}
LOG 🔚 STT engine ended
LOG ⏳ STT engine ended, waiting for button release to complete processing
LOG ✅ FastLLM categorized as: transaction_search
LOG ⚡ FastLLM took 1035ms
LOG ⚡ FastLLM completed in 1037ms
LOG 🎵 Playing filler audio: transaction_search
LOG ✅ Found content in Claude response
LOG 🧠 Claude Raw Response: {
"type": "bill_selection",
"response": "هل تأكد دفع فاتورة الكهرباء بمبلغ مئتان وستة وثمانون ريال؟",
"actionData": {
"matched_bills": [
{
"id": "bill_001",
"provider": "شركة الكهرباء السعودية",
"amount": 286,
"dueDate": "2024-01-20"
}
],
"total_amount": 286
}
}
LOG 🧠 Claude Parsed Response Type: bill_selection
LOG 🧠 Claude Parsed Response Text: هل تأكد دفع فاتورة الكهرباء بمبلغ مئتان وستة وثمانون ريال؟
LOG ⚡ SmartLLM (Claude) took 3767ms
LOG 🧠 SmartLLM completed in 3780ms total
LOG 💰 Bill selection data received: {"matched_bills": [{"amount": 286, "dueDate": "2024-01-20", "id": "bill_001", "provider": "شركة الكهرباء السعودية"}], "total_amount": 286}
LOG 🗣️ TTS start: هل تأكد دفع فاتورة الكهرباء بمبلغ مئتان وستة وثمانون ريال؟
LOG 🎤 Voice state changed: {"busy": true, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": false, "voiceState": "speaking"}
LOG ✅ TTS generated
LOG 🎵 Creating audio player for: file:///data/user/0/com.yousef54ai.echoPay/cache/tts_1753923157249.mp3
LOG ▶️ Audio playing
LOG ⚡ TTS took 1573ms
LOG 🎤 Voice state changed: {"busy": false, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": false, "voiceState": "speaking"}
LOG 🎙️ Button pressed - Current state: speaking Busy: false
LOG 🎙️ Button PRESSED (1753923163188)
LOG 🎯 STT: Starting listening session
LOG 🔄 Voice session reset
LOG 🔄 STT Processing = TRUE (1753923163193)
LOG ✅ Started listening
LOG 🎤 Voice state changed: {"busy": false, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": true, "voiceState": "listening"}
LOG ✅ STT engine started
LOG 🎙️ STT engine started listening
LOG 🎤 Voice state changed: {"busy": false, "finalTextLength": 0, "isButtonHeld": false, "isListening": true, "isSTTProcessing": true, "voiceState": "listening"}
LOG 🎙️ STT (FINAL): نعم اكد الدفع
LOG 🎯 STT: Got final segment, accumulating: نعم اكد الدفع
LOG 📝 Accumulated text: نعم اكد الدفع...
LOG 🎯 Final Text Updated: "نعم اكد الدفع" (1753923166659)
LOG ⏳ STT segment complete, waiting for button release...
LOG 🎤 Voice state changed: {"busy": false, "finalTextLength": 13, "isButtonHeld": false, "isListening": true, "isSTTProcessing": true, "voiceState": "listening"}
LOG 🎙️ Button release event - Current state: listening Hold duration: 4017ms
LOG ✅ Accepting button release
LOG 🎙️ Button RELEASED (1753923167206)
LOG 🎯 STT: Stopping listening session
LOG ✅ Stopped listening
LOG 🎯 Button released - marking STT processing complete
LOG 🔄 STT Processing = FALSE (1753923167208)
LOG 🎤 Voice state changed: {"busy": false, "finalTextLength": 13, "isButtonHeld": false, "isListening": true, "isSTTProcessing": false, "voiceState": "listening"}
LOG 🔄 State changed to processing conditions - triggering checkAndProcess
LOG 🔍 CheckAndProcess called (1753923167226): {"hasText": true, "isButtonHeld": false, "isSTTProcessing": false, "textLength": 13, "textPreview": "نعم اكد الدفع"}
LOG ✅ PROCESSING COMMAND: "نعم اكد الدفع" (1753923167226)
LOG 🚀 Starting parallel LLM execution
LOG 🧠 SmartLLM System Prompt Length: 7919
LOG 🧠 SmartLLM System Prompt (first 300 chars): You are Echo, a Saudi banking assistant. Help users with banking operations using their data.

# RESPONSE TYPES:

**info** - When user asks about their data (balance, transactions, bills list)

-   Include full details in response text
-   Use Arabic words for numbers in response

**bill_selection** - Wh...
LOG 🧠 SmartLLM System Prompt contains bills data: true
LOG 🧠 SmartLLM Bills section (first 200 chars): Bills: [
{
"id": "bill_001",
"provider": "شركة الكهرباء السعودية",
"type": "كهرباء",
"amount": 286,
"dueDate": "2024-01-20",
"status": "مستحقة",
"accountNumber": "1234567...
LOG 🧠 SmartLLM Conversation History:
LOG user: "ابي اسدد فاتوره الكهرباء لو سمحت"
LOG assistant: "هل تأكد دفع فاتورة الكهرباء بمبلغ مئتان وستة وثمانون ريال؟"
LOG user: "نعم اكد الدفع"
LOG 🧠 SmartLLM Total Messages: 3
LOG 🧠 SmartLLM Latest User Message: نعم اكد الدفع
LOG 🎤 Voice state changed: {"busy": true, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": false, "voiceState": "processing"}
LOG 🔚 STT engine ended
LOG ⏳ STT engine ended, waiting for button release to complete processing
LOG ✅ FastLLM categorized as: transfer_payment
LOG ⚡ FastLLM took 624ms
LOG ⚡ FastLLM completed in 624ms
LOG 🎵 Playing filler audio: transfer_payment
LOG ✅ Found content in Claude response
LOG 🧠 Claude Raw Response: {
"type": "bill_payment",
"response": "تم دفع فاتورة الكهرباء بنجاح",
"actionData": {
"action": "confirm_payment",
"final_bills": ["bill_001"],
"payment_source": "checking",
"total_amount": 286
}
}
LOG 🧠 Claude Parsed Response Type: bill_payment
LOG 🧠 Claude Parsed Response Text: تم دفع فاتورة الكهرباء بنجاح
LOG ⚡ SmartLLM (Claude) took 2691ms
LOG 🧠 SmartLLM completed in 2691ms total
LOG 💰 Added bill payment transactions: 1
LOG - دفع فاتورة شركة الكهرباء السعودية: -286 ريال
LOG 📋 Updated bill statuses to 'غير مستحقة': 1
LOG 🔇 Stopping filler audio
LOG 🗣️ TTS start: تم دفع فاتورة الكهرباء بنجاح
LOG 🔄 LLM context updated automatically
LOG 🎤 Voice state changed: {"busy": true, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": false, "voiceState": "speaking"}
LOG ✅ TTS generated
LOG 🎵 Creating audio player for: file:///data/user/0/com.yousef54ai.echoPay/cache/tts_1753923170575.mp3
LOG ▶️ Audio playing
LOG ⚡ TTS took 664ms
LOG 🎤 Voice state changed: {"busy": false, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": false, "voiceState": "speaking"}
LOG 🎯 STT: Stopping listening session
LOG 🤖 LLM context initialized
LOG 🎤 Voice state changed: {"busy": false, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": false, "voiceState": "idle"}
LOG 🎙️ Button pressed - Current state: idle Busy: false
LOG 🎙️ Button PRESSED (1753923187328)
LOG 🎯 STT: Starting listening session
LOG 🔄 Voice session reset
LOG 🔄 STT Processing = TRUE (1753923187333)
LOG ✅ Started listening
LOG 🎤 Voice state changed: {"busy": false, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": true, "voiceState": "listening"}
LOG ✅ STT engine started
LOG 🎙️ STT engine started listening
LOG 🎤 Voice state changed: {"busy": false, "finalTextLength": 0, "isButtonHeld": false, "isListening": true, "isSTTProcessing": true, "voiceState": "listening"}
LOG 🎙️ STT (FINAL): وش عندي فواتير ثانيه ما سددتهن
LOG 🎯 STT: Got final segment, accumulating: وش عندي فواتير ثانيه ما سددتهن
LOG 📝 Accumulated text: وش عندي فواتير ثانيه ما سددتهن...
LOG 🎯 Final Text Updated: "وش عندي فواتير ثانيه ما سددتهن" (1753923191991)
LOG ⏳ STT segment complete, waiting for button release...
LOG 🎤 Voice state changed: {"busy": false, "finalTextLength": 30, "isButtonHeld": false, "isListening": true, "isSTTProcessing": true, "voiceState": "listening"}
LOG 🎙️ Button release event - Current state: listening Hold duration: 5393ms
LOG ✅ Accepting button release
LOG 🎙️ Button RELEASED (1753923192722)
LOG 🎯 STT: Stopping listening session
LOG ✅ Stopped listening
LOG 🎯 Button released - marking STT processing complete
LOG 🔄 STT Processing = FALSE (1753923192725)
LOG 🎤 Voice state changed: {"busy": false, "finalTextLength": 30, "isButtonHeld": false, "isListening": true, "isSTTProcessing": false, "voiceState": "listening"}
LOG 🔄 State changed to processing conditions - triggering checkAndProcess
LOG 🔍 CheckAndProcess called (1753923192743): {"hasText": true, "isButtonHeld": false, "isSTTProcessing": false, "textLength": 30, "textPreview": "وش عندي فواتير ثانيه"}
LOG ✅ PROCESSING COMMAND: "وش عندي فواتير ثانيه ما سددتهن" (1753923192743)
LOG 🚀 Starting parallel LLM execution
LOG 🧠 SmartLLM System Prompt Length: 7990
LOG 🧠 SmartLLM System Prompt (first 300 chars): You are Echo, a Saudi banking assistant. Help users with banking operations using their data.

# RESPONSE TYPES:

**info** - When user asks about their data (balance, transactions, bills list)

-   Include full details in response text
-   Use Arabic words for numbers in response

**bill_selection** - Wh...
LOG 🧠 SmartLLM System Prompt contains bills data: true
LOG 🧠 SmartLLM Bills section (first 200 chars): Bills: [
{
"id": "bill_001",
"provider": "شركة الكهرباء السعودية",
"type": "كهرباء",
"amount": 286,
"dueDate": "2024-01-20",
"status": "غير مستحقة",
"accountNumber": "123...
LOG 🧠 SmartLLM Conversation History:
LOG user: "وش عندي فواتير ثانيه ما سددتهن"
LOG 🧠 SmartLLM Total Messages: 1
LOG 🧠 SmartLLM Latest User Message: وش عندي فواتير ثانيه ما سددتهن
LOG 🎤 Voice state changed: {"busy": true, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": false, "voiceState": "processing"}
LOG 🔚 STT engine ended
LOG ⏳ STT engine ended, waiting for button release to complete processing
LOG ✅ FastLLM categorized as: transaction_search
LOG ⚡ FastLLM took 474ms
LOG ⚡ FastLLM completed in 474ms
LOG 🎵 Playing filler audio: transaction_search
LOG ✅ Found content in Claude response
LOG 🧠 Claude Raw Response: {
"type": "info",
"response": "فاتورة مياه خمسة وتسعون ريال، وجوال مئة وخمسة وعشرون ريال",
"actionData": {
"unpaid_bills": [
{
"id": "bill_002",
"amount": 95,
"provider": "شركة المياه الوطنية"
},
{
"id": "bill_003",
"amount": 125,
"provider": "زين السعودية"
}
],
"total_amount": 220
}
}
LOG 🧠 Claude Parsed Response Type: info
LOG 🧠 Claude Parsed Response Text: فاتورة مياه خمسة وتسعون ريال، وجوال مئة وخمسة وعشرون ريال
LOG ⚡ SmartLLM (Claude) took 3973ms
LOG 🧠 SmartLLM completed in 3974ms total
LOG 🗣️ TTS start: فاتورة مياه خمسة وتسعون ريال، وجوال مئة وخمسة وعشرون ريال
LOG 🎤 Voice state changed: {"busy": true, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": false, "voiceState": "speaking"}
LOG ✅ TTS generated
LOG 🎵 Creating audio player for: file:///data/user/0/com.yousef54ai.echoPay/cache/tts_1753923197610.mp3
LOG ▶️ Audio playing
LOG ⚡ TTS took 901ms
LOG 🎤 Voice state changed: {"busy": false, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": false, "voiceState": "speaking"}
LOG 🎙️ Button pressed - Current state: speaking Busy: false
LOG 🎙️ Button PRESSED (1753923205737)
LOG 🎯 STT: Starting listening session
LOG 🔄 Voice session reset
LOG 🔄 STT Processing = TRUE (1753923205741)
LOG ✅ Started listening
LOG 🎤 Voice state changed: {"busy": false, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": true, "voiceState": "listening"}
LOG ✅ STT engine started
LOG 🎙️ STT engine started listening
LOG 🎤 Voice state changed: {"busy": false, "finalTextLength": 0, "isButtonHeld": false, "isListening": true, "isSTTProcessing": true, "voiceState": "listening"}
LOG 🎙️ STT (FINAL): طيب ابي اسددهن كلهن
LOG 🎯 STT: Got final segment, accumulating: طيب ابي اسددهن كلهن
LOG 📝 Accumulated text: طيب ابي اسددهن كلهن...
LOG 🎯 Final Text Updated: "طيب ابي اسددهن كلهن" (1753923209741)
LOG ⏳ STT segment complete, waiting for button release...
LOG 🎤 Voice state changed: {"busy": false, "finalTextLength": 19, "isButtonHeld": false, "isListening": true, "isSTTProcessing": true, "voiceState": "listening"}
LOG 🎙️ Button release event - Current state: listening Hold duration: 4818ms
LOG ✅ Accepting button release
LOG 🎙️ Button RELEASED (1753923210556)
LOG 🎯 STT: Stopping listening session
LOG ✅ Stopped listening
LOG 🎯 Button released - marking STT processing complete
LOG 🔄 STT Processing = FALSE (1753923210558)
LOG 🎤 Voice state changed: {"busy": false, "finalTextLength": 19, "isButtonHeld": false, "isListening": true, "isSTTProcessing": false, "voiceState": "listening"}
LOG 🔄 State changed to processing conditions - triggering checkAndProcess
LOG 🔍 CheckAndProcess called (1753923210578): {"hasText": true, "isButtonHeld": false, "isSTTProcessing": false, "textLength": 19, "textPreview": "طيب ابي اسددهن كلهن"}
LOG ✅ PROCESSING COMMAND: "طيب ابي اسددهن كلهن" (1753923210578)
LOG 🚀 Starting parallel LLM execution
LOG 🧠 SmartLLM System Prompt Length: 7990
LOG 🧠 SmartLLM System Prompt (first 300 chars): You are Echo, a Saudi banking assistant. Help users with banking operations using their data.

# RESPONSE TYPES:

**info** - When user asks about their data (balance, transactions, bills list)

-   Include full details in response text
-   Use Arabic words for numbers in response

**bill_selection** - Wh...
LOG 🧠 SmartLLM System Prompt contains bills data: true
LOG 🧠 SmartLLM Bills section (first 200 chars): Bills: [
{
"id": "bill_001",
"provider": "شركة الكهرباء السعودية",
"type": "كهرباء",
"amount": 286,
"dueDate": "2024-01-20",
"status": "غير مستحقة",
"accountNumber": "123...
LOG 🧠 SmartLLM Conversation History:
LOG user: "وش عندي فواتير ثانيه ما سددتهن"
LOG assistant: "فاتورة مياه خمسة وتسعون ريال، وجوال مئة وخمسة وعشرون ريال"
LOG user: "طيب ابي اسددهن كلهن"
LOG 🧠 SmartLLM Total Messages: 3
LOG 🧠 SmartLLM Latest User Message: طيب ابي اسددهن كلهن
LOG 🎤 Voice state changed: {"busy": true, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": false, "voiceState": "processing"}
LOG 🔚 STT engine ended
LOG ⏳ STT engine ended, waiting for button release to complete processing
LOG ✅ FastLLM categorized as: transfer_payment
LOG ⚡ FastLLM took 706ms
LOG ⚡ FastLLM completed in 706ms
LOG 🎵 Playing filler audio: transfer_payment
LOG ✅ Found content in Claude response
LOG 🧠 Claude Raw Response: {
"type": "bill_selection",
"response": "هل تأكد دفع الفواتير بمجموع مئتان وعشرون ريال؟",
"actionData": {
"matched_bills": [
{
"id": "bill_002",
"provider": "شركة المياه الوطنية",
"amount": 95,
"dueDate": "2024-01-25"
},
{
"id": "bill_003",
"provider": "زين السعودية",
"amount": 125,
"dueDate": "2024-01-18"
}
],
"total_amount": 220
}
}
LOG 🧠 Claude Parsed Response Type: bill_selection
LOG 🧠 Claude Parsed Response Text: هل تأكد دفع الفواتير بمجموع مئتان وعشرون ريال؟
LOG ⚡ SmartLLM (Claude) took 4406ms
LOG 🧠 SmartLLM completed in 4407ms total
LOG 💰 Bill selection data received: {"matched_bills": [{"amount": 95, "dueDate": "2024-01-25", "id": "bill_002", "provider": "شركة المياه الوطنية"}, {"amount": 125, "dueDate": "2024-01-18", "id": "bill_003", "provider": "زين السعودية"}], "total_amount": 220}
LOG 🗣️ TTS start: هل تأكد دفع الفواتير بمجموع مئتان وعشرون ريال؟
LOG 🎤 Voice state changed: {"busy": true, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": false, "voiceState": "speaking"}
LOG ✅ TTS generated
LOG 🎵 Creating audio player for: file:///data/user/0/com.yousef54ai.echoPay/cache/tts_1753923215747.mp3
LOG ▶️ Audio playing
LOG ⚡ TTS took 769ms
LOG 🎤 Voice state changed: {"busy": false, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": false, "voiceState": "speaking"}
LOG 🎙️ Button pressed - Current state: speaking Busy: false
LOG 🎙️ Button PRESSED (1753923221521)
LOG 🎯 STT: Starting listening session
LOG 🔄 Voice session reset
LOG 🔄 STT Processing = TRUE (1753923221524)
LOG ✅ Started listening
LOG 🎤 Voice state changed: {"busy": false, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": true, "voiceState": "listening"}
LOG ✅ STT engine started
LOG 🎙️ STT engine started listening
LOG 🎤 Voice state changed: {"busy": false, "finalTextLength": 0, "isButtonHeld": false, "isListening": true, "isSTTProcessing": true, "voiceState": "listening"}
LOG 🎙️ STT (FINAL): نعم
LOG 🎯 STT: Got final segment, accumulating: نعم
LOG 📝 Accumulated text: نعم...
LOG 🎯 Final Text Updated: "نعم" (1753923224756)
LOG ⏳ STT segment complete, waiting for button release...
LOG 🎤 Voice state changed: {"busy": false, "finalTextLength": 3, "isButtonHeld": false, "isListening": true, "isSTTProcessing": true, "voiceState": "listening"}
LOG 🎙️ Button release event - Current state: listening Hold duration: 4868ms
LOG ✅ Accepting button release
LOG 🎙️ Button RELEASED (1753923226389)
LOG 🎯 STT: Stopping listening session
LOG ✅ Stopped listening
LOG 🎯 Button released - marking STT processing complete
LOG 🔄 STT Processing = FALSE (1753923226391)
LOG 🎤 Voice state changed: {"busy": false, "finalTextLength": 3, "isButtonHeld": false, "isListening": true, "isSTTProcessing": false, "voiceState": "listening"}
LOG 🔄 State changed to processing conditions - triggering checkAndProcess
LOG 🔍 CheckAndProcess called (1753923226407): {"hasText": true, "isButtonHeld": false, "isSTTProcessing": false, "textLength": 3, "textPreview": "نعم"}
LOG ✅ PROCESSING COMMAND: "نعم" (1753923226407)
LOG 🚀 Starting parallel LLM execution
LOG 🧠 SmartLLM System Prompt Length: 7990
LOG 🧠 SmartLLM System Prompt (first 300 chars): You are Echo, a Saudi banking assistant. Help users with banking operations using their data.

# RESPONSE TYPES:

**info** - When user asks about their data (balance, transactions, bills list)

-   Include full details in response text
-   Use Arabic words for numbers in response

**bill_selection** - Wh...
LOG 🧠 SmartLLM System Prompt contains bills data: true
LOG 🧠 SmartLLM Bills section (first 200 chars): Bills: [
{
"id": "bill_001",
"provider": "شركة الكهرباء السعودية",
"type": "كهرباء",
"amount": 286,
"dueDate": "2024-01-20",
"status": "غير مستحقة",
"accountNumber": "123...
LOG 🧠 SmartLLM Conversation History:
LOG user: "وش عندي فواتير ثانيه ما سددتهن"
LOG assistant: "فاتورة مياه خمسة وتسعون ريال، وجوال مئة وخمسة وعشرون ريال"
LOG user: "طيب ابي اسددهن كلهن"
LOG assistant: "هل تأكد دفع الفواتير بمجموع مئتان وعشرون ريال؟"
LOG user: "نعم"
LOG 🧠 SmartLLM Total Messages: 5
LOG 🧠 SmartLLM Latest User Message: نعم
LOG 🎤 Voice state changed: {"busy": true, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": false, "voiceState": "processing"}
LOG 🔚 STT engine ended
LOG ⏳ STT engine ended, waiting for button release to complete processing
LOG ✅ FastLLM categorized as: general_request
LOG ⚡ FastLLM took 611ms
LOG ⚡ FastLLM completed in 611ms
LOG 🎵 Playing filler audio: general_request
LOG ✅ Found content in Claude response
LOG 🧠 Claude Raw Response: {
"type": "bill_payment",
"response": "تم بنجاح دفع الفواتير بمبلغ مئتان وعشرون ريال",
"actionData": {
"action": "confirm_payment",
"final_bills": ["bill_002", "bill_003"],
"payment_source": "checking",
"total_amount": 220
}
}
LOG 🧠 Claude Parsed Response Type: bill_payment
LOG 🧠 Claude Parsed Response Text: تم بنجاح دفع الفواتير بمبلغ مئتان وعشرون ريال
LOG ⚡ SmartLLM (Claude) took 2853ms
LOG 🧠 SmartLLM completed in 2854ms total
LOG 💰 Added bill payment transactions: 2
LOG - دفع فاتورة شركة المياه الوطنية: -95 ريال
LOG - دفع فاتورة زين السعودية: -125 ريال
LOG 📋 Updated bill statuses to 'غير مستحقة': 2
LOG 🗣️ TTS start: تم بنجاح دفع الفواتير بمبلغ مئتان وعشرون ريال
LOG 🔄 LLM context updated automatically
LOG 🎤 Voice state changed: {"busy": true, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": false, "voiceState": "speaking"}
LOG ✅ TTS generated
LOG 🎵 Creating audio player for: file:///data/user/0/com.yousef54ai.echoPay/cache/tts_1753923230087.mp3
LOG ▶️ Audio playing
LOG ⚡ TTS took 832ms
LOG 🎤 Voice state changed: {"busy": false, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": false, "voiceState": "speaking"}
LOG 🎯 STT: Stopping listening session
