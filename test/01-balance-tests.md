# Balance Inquiry Tests

## Test 1.1: General Balance Inquiry

### Expected Behavior

-   User asks: "كم رصيدي؟"
-   Should return: `type: "info"` with total balance in Arabic words
-   Should NOT include account breakdown (per new concise response rule)

### Test Steps

1. Say: "كم رصيدي؟"
2. Expect: Simple total balance response
3. Verify: Uses Arabic words for numbers in TTS

### Success Criteria

-   [ ] Correct response type (info)
-   [ ] Concise response (total only, no breakdown)
-   [ ] Arabic numbers in TTS ("ثمانية عشر ألف ريال")
-   [ ] No extra details unless requested

### Logs

```
Android Bundled 93ms node_modules/expo-router/entry.js (1 module)
 LOG  ✅ Audio session configured
 LOG  🎤 Voice state changed: {"busy": false, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": false, "voiceState": "idle"}
 LOG  🎙️ Button pressed - Current state: idle Busy: false
 LOG  🎙️ Button PRESSED (1753921127354)
 LOG  🎯 STT: Starting listening session
 LOG  🔄 Voice session reset
 LOG  🔄 STT Processing = TRUE (1753921127362)
 LOG  ✅ Started listening
 LOG  🎤 Voice state changed: {"busy": false, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": true, "voiceState": "listening"}
 LOG  ✅ STT engine started
 LOG  🎙️ STT engine started listening
 LOG  🎤 Voice state changed: {"busy": false, "finalTextLength": 0, "isButtonHeld": false, "isListening": true, "isSTTProcessing": true, "voiceState": "listening"}
 LOG  🎙️ STT (FINAL): كم رصيدي
 LOG  🎯 STT: Got final segment, accumulating: كم رصيدي
 LOG  📝 Accumulated text: كم رصيدي...
 LOG  🎯 Final Text Updated: "كم رصيدي" (1753921130654)
 LOG  ⏳ STT segment complete, waiting for button release...
 LOG  🎤 Voice state changed: {"busy": false, "finalTextLength": 8, "isButtonHeld": false, "isListening": true, "isSTTProcessing": true, "voiceState": "listening"}
 LOG  🎙️ Button release event - Current state: listening Hold duration: 3872ms
 LOG  ✅ Accepting button release
 LOG  🎙️ Button RELEASED (1753921131226)
 LOG  🎯 STT: Stopping listening session
 LOG  ✅ Stopped listening
 LOG  🎯 Button released - marking STT processing complete
 LOG  🔄 STT Processing = FALSE (1753921131233)
 LOG  🎤 Voice state changed: {"busy": false, "finalTextLength": 8, "isButtonHeld": false, "isListening": true, "isSTTProcessing": false, "voiceState": "listening"}
 LOG  🔄 State changed to processing conditions - triggering checkAndProcess
 LOG  🔍 CheckAndProcess called (1753921131246): {"hasText": true, "isButtonHeld": false, "isSTTProcessing": false, "textLength": 8, "textPreview": "كم رصيدي"}
 LOG  ✅ PROCESSING COMMAND: "كم رصيدي" (1753921131246)
 LOG  🚀 Starting parallel LLM execution
 LOG  🧠 SmartLLM System Prompt Length: 7919
 LOG  🧠 SmartLLM System Prompt (first 300 chars): You are Echo, a Saudi banking assistant. Help users with banking operations using their data.

# RESPONSE TYPES:

**info** - When user asks about their data (balance, transactions, bills list)
- Include full details in response text
- Use Arabic words for numbers in response

**bill_selection** - Wh...
 LOG  🧠 SmartLLM System Prompt contains bills data: true
 LOG  🧠 SmartLLM Bills section (first 200 chars): Bills: [
  {
    "id": "bill_001",
    "provider": "شركة الكهرباء السعودية",
    "type": "كهرباء",
    "amount": 286,
    "dueDate": "2024-01-20",
    "status": "مستحقة",
    "accountNumber": "1234567...
 LOG  🧠 SmartLLM Conversation History:
 LOG    user: "كم رصيدي"
 LOG  🧠 SmartLLM Total Messages: 1
 LOG  🧠 SmartLLM Latest User Message: كم رصيدي
 LOG  🎤 Voice state changed: {"busy": true, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": false, "voiceState": "processing"}
 LOG  🔚 STT engine ended
 LOG  ⏳ STT engine ended, waiting for button release to complete processing
 LOG  ✅ FastLLM categorized as: balance_check
 LOG  ⚡ FastLLM took 1539ms
 LOG  ⚡ FastLLM completed in 1540ms
 LOG  🎵 Playing filler audio: balance_check
 LOG  ✅ Found content in Claude response
 LOG  🧠 Claude Raw Response: {
  "type": "info",
  "response": "رصيد حسابك الجاري خمسة آلاف ومئتان وثلاثة وستون ريال، والتوفير إثنا عشر ألف وثمانمئة وواحد وخمسون ريال"
}
 LOG  🧠 Claude Parsed Response Type: info
 LOG  🧠 Claude Parsed Response Text: رصيد حسابك الجاري خمسة آلاف ومئتان وثلاثة وستون ريال، والتوفير إثنا عشر ألف وثمانمئة وواحد وخمسون ريال
 LOG  ⚡ SmartLLM (Claude) took 4703ms
 LOG  🧠 SmartLLM completed in 4720ms total
 LOG  🗣️ TTS start: رصيد حسابك الجاري خمسة آلاف ومئتان وثلاثة وستون ريال، والتوفير إثنا عشر ألف وثمانمئة وواحد وخمسون ريال
 LOG  🎤 Voice state changed: {"busy": true, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": false, "voiceState": "speaking"}
 LOG  ✅ TTS generated
 LOG  🎵 Creating audio player for: file:///data/user/0/com.yousef54ai.echoPay/cache/tts_1753921137757.mp3
 LOG  ▶️ Audio playing
 LOG  ⚡ TTS took 1801ms
 LOG  🎤 Voice state changed: {"busy": false, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": false, "voiceState": "speaking"}
```

### Issues Found

-   Issue 1:
-   Issue 2:

---

## Test 1.2: Specific Account Balance

### Expected Behavior

-   User asks: "كم رصيد الحساب الجاري؟"
-   Should return: Only checking account balance
-   Should be brief and specific

### Test Steps

1. Say: "كم رصيد الحساب الجاري؟"
2. Expect: Checking account balance only
3. Verify: No savings account info included

### Success Criteria

-   [ ] Correct response type (info)
-   [ ] Only requested account balance
-   [ ] Arabic numbers in response

### Logs

```

Android Bundled 72ms node_modules/expo-router/entry.js (1 module)
 LOG  ✅ Audio session configured
 LOG  🎤 Voice state changed: {"busy": false, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": false, "voiceState": "idle"}
 LOG  🎙️ Button pressed - Current state: idle Busy: false
 LOG  🎙️ Button PRESSED (1753921175055)
 LOG  🎯 STT: Starting listening session
 LOG  🔄 Voice session reset
 LOG  🔄 STT Processing = TRUE (1753921175063)
 LOG  ✅ Started listening
 LOG  🎤 Voice state changed: {"busy": false, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": true, "voiceState": "listening"}
 LOG  ✅ STT engine started
 LOG  🎙️ STT engine started listening
 LOG  🎤 Voice state changed: {"busy": false, "finalTextLength": 0, "isButtonHeld": false, "isListening": true, "isSTTProcessing": true, "voiceState": "listening"}
 LOG  🎙️ STT (FINAL): كم رصيد الحساب الجاري
 LOG  🎯 STT: Got final segment, accumulating: كم رصيد الحساب الجاري
 LOG  📝 Accumulated text: كم رصيد الحساب الجاري...
 LOG  🎯 Final Text Updated: "كم رصيد الحساب الجاري" (1753921179874)
 LOG  ⏳ STT segment complete, waiting for button release...
 LOG  🎤 Voice state changed: {"busy": false, "finalTextLength": 21, "isButtonHeld": false, "isListening": true, "isSTTProcessing": true, "voiceState": "listening"}
 LOG  🎙️ Button release event - Current state: listening Hold duration: 5550ms
 LOG  ✅ Accepting button release
 LOG  🎙️ Button RELEASED (1753921180606)
 LOG  🎯 STT: Stopping listening session
 LOG  ✅ Stopped listening
 LOG  🎯 Button released - marking STT processing complete
 LOG  🔄 STT Processing = FALSE (1753921180609)
 LOG  🎤 Voice state changed: {"busy": false, "finalTextLength": 21, "isButtonHeld": false, "isListening": true, "isSTTProcessing": false, "voiceState": "listening"}
 LOG  🔄 State changed to processing conditions - triggering checkAndProcess
 LOG  🔍 CheckAndProcess called (1753921180627): {"hasText": true, "isButtonHeld": false, "isSTTProcessing": false, "textLength": 21, "textPreview": "كم رصيد الحساب الجار"}
 LOG  ✅ PROCESSING COMMAND: "كم رصيد الحساب الجاري" (1753921180627)
 LOG  🚀 Starting parallel LLM execution
 LOG  🧠 SmartLLM System Prompt Length: 7919
 LOG  🧠 SmartLLM System Prompt (first 300 chars): You are Echo, a Saudi banking assistant. Help users with banking operations using their data.

# RESPONSE TYPES:

**info** - When user asks about their data (balance, transactions, bills list)
- Include full details in response text
- Use Arabic words for numbers in response

**bill_selection** - Wh...
 LOG  🧠 SmartLLM System Prompt contains bills data: true
 LOG  🧠 SmartLLM Bills section (first 200 chars): Bills: [
  {
    "id": "bill_001",
    "provider": "شركة الكهرباء السعودية",
    "type": "كهرباء",
    "amount": 286,
    "dueDate": "2024-01-20",
    "status": "مستحقة",
    "accountNumber": "1234567...
 LOG  🧠 SmartLLM Conversation History:
 LOG    user: "كم رصيد الحساب الجاري"
 LOG  🧠 SmartLLM Total Messages: 1
 LOG  🧠 SmartLLM Latest User Message: كم رصيد الحساب الجاري
 LOG  🎤 Voice state changed: {"busy": true, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": false, "voiceState": "processing"}
 LOG  🔚 STT engine ended
 LOG  ⏳ STT engine ended, waiting for button release to complete processing
 LOG  ✅ FastLLM categorized as: balance_check
 LOG  ⚡ FastLLM took 1126ms
 LOG  ⚡ FastLLM completed in 1126ms
 LOG  🎵 Playing filler audio: balance_check
 LOG  ✅ Found content in Claude response
 LOG  🧠 Claude Raw Response: {
  "type": "info",
  "response": "رصيد حسابك الجاري خمسة آلاف ومئتان وثلاثة وستون ريال"
}
 LOG  🧠 Claude Parsed Response Type: info
 LOG  🧠 Claude Parsed Response Text: رصيد حسابك الجاري خمسة آلاف ومئتان وثلاثة وستون ريال
 LOG  ⚡ SmartLLM (Claude) took 3064ms
 LOG  🧠 SmartLLM completed in 3073ms total
 LOG  🗣️ TTS start: رصيد حسابك الجاري خمسة آلاف ومئتان وثلاثة وستون ريال
 LOG  🎤 Voice state changed: {"busy": true, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": false, "voiceState": "speaking"}
 LOG  ✅ TTS generated
 LOG  🎵 Creating audio player for: file:///data/user/0/com.yousef54ai.echoPay/cache/tts_1753921185244.mp3
 LOG  ▶️ Audio playing
 LOG  ⚡ TTS took 1553ms
 LOG  🎤 Voice state changed: {"busy": false, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": false, "voiceState": "speaking"}
```

### Issues Found

-   Issue 1:
-   Issue 2:

---

## Test 1.3: Savings Account Balance

### Expected Behavior

-   User asks: "كم رصيد التوفير؟"
-   Should return: Only savings account balance

### Test Steps

1. Say: "كم رصيد التوفير؟"
2. Expect: Savings account balance only

### Success Criteria

-   [ ] Correct response type (info)
-   [ ] Only savings balance shown
-   [ ] Proper Arabic number pronunciation

### Logs

```
Android Bundled 63ms node_modules/expo-router/entry.js (1 module)
 LOG  ✅ Audio session configured
 LOG  🎤 Voice state changed: {"busy": false, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": false, "voiceState": "idle"}
 LOG  🎙️ Button pressed - Current state: idle Busy: false
 LOG  🎙️ Button PRESSED (1753921220054)
 LOG  🎯 STT: Starting listening session
 LOG  🔄 Voice session reset
 LOG  🔄 STT Processing = TRUE (1753921220060)
 LOG  ✅ Started listening
 LOG  🎤 Voice state changed: {"busy": false, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": true, "voiceState": "listening"}
 LOG  ✅ STT engine started
 LOG  🎙️ STT engine started listening
 LOG  🎤 Voice state changed: {"busy": false, "finalTextLength": 0, "isButtonHeld": false, "isListening": true, "isSTTProcessing": true, "voiceState": "listening"}
 LOG  🎙️ STT (FINAL): كم رصيد التوفير
 LOG  🎯 STT: Got final segment, accumulating: كم رصيد التوفير
 LOG  📝 Accumulated text: كم رصيد التوفير...
 LOG  🎯 Final Text Updated: "كم رصيد التوفير" (1753921223976)
 LOG  ⏳ STT segment complete, waiting for button release...
 LOG  🎤 Voice state changed: {"busy": false, "finalTextLength": 15, "isButtonHeld": false, "isListening": true, "isSTTProcessing": true, "voiceState": "listening"}
 LOG  🎙️ Button release event - Current state: listening Hold duration: 4668ms
 LOG  ✅ Accepting button release
 LOG  🎙️ Button RELEASED (1753921224722)
 LOG  🎯 STT: Stopping listening session
 LOG  ✅ Stopped listening
 LOG  🎯 Button released - marking STT processing complete
 LOG  🔄 STT Processing = FALSE (1753921224724)
 LOG  🎤 Voice state changed: {"busy": false, "finalTextLength": 15, "isButtonHeld": false, "isListening": true, "isSTTProcessing": false, "voiceState": "listening"}
 LOG  🔄 State changed to processing conditions - triggering checkAndProcess
 LOG  🔍 CheckAndProcess called (1753921224742): {"hasText": true, "isButtonHeld": false, "isSTTProcessing": false, "textLength": 15, "textPreview": "كم رصيد التوفير"}
 LOG  ✅ PROCESSING COMMAND: "كم رصيد التوفير" (1753921224742)
 LOG  🚀 Starting parallel LLM execution
 LOG  🧠 SmartLLM System Prompt Length: 7919
 LOG  🧠 SmartLLM System Prompt (first 300 chars): You are Echo, a Saudi banking assistant. Help users with banking operations using their data.

# RESPONSE TYPES:

**info** - When user asks about their data (balance, transactions, bills list)
- Include full details in response text
- Use Arabic words for numbers in response

**bill_selection** - Wh...
 LOG  🧠 SmartLLM System Prompt contains bills data: true
 LOG  🧠 SmartLLM Bills section (first 200 chars): Bills: [
  {
    "id": "bill_001",
    "provider": "شركة الكهرباء السعودية",
    "type": "كهرباء",
    "amount": 286,
    "dueDate": "2024-01-20",
    "status": "مستحقة",
    "accountNumber": "1234567...
 LOG  🧠 SmartLLM Conversation History:
 LOG    user: "كم رصيد التوفير"
 LOG  🧠 SmartLLM Total Messages: 1
 LOG  🧠 SmartLLM Latest User Message: كم رصيد التوفير
 LOG  🎤 Voice state changed: {"busy": true, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": false, "voiceState": "processing"}
 LOG  🔚 STT engine ended
 LOG  ⏳ STT engine ended, waiting for button release to complete processing
 LOG  ✅ FastLLM categorized as: balance_check
 LOG  ⚡ FastLLM took 1309ms
 LOG  ⚡ FastLLM completed in 1310ms
 LOG  🎵 Playing filler audio: balance_check
 LOG  ✅ Found content in Claude response
 LOG  🧠 Claude Raw Response: {
  "type": "info",
  "response": "رصيد حساب التوفير اثنا عشر ألفاً وثمانمئة وواحد وخمسون ريال"
}
 LOG  🧠 Claude Parsed Response Type: info
 LOG  🧠 Claude Parsed Response Text: رصيد حساب التوفير اثنا عشر ألفاً وثمانمئة وواحد وخمسون ريال
 LOG  ⚡ SmartLLM (Claude) took 4166ms
 LOG  🧠 SmartLLM completed in 4175ms total
 LOG  🗣️ TTS start: رصيد حساب التوفير اثنا عشر ألفاً وثمانمئة وواحد وخمسون ريال
 LOG  🎤 Voice state changed: {"busy": true, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": false, "voiceState": "speaking"}
 LOG  ✅ TTS generated
 LOG  🎵 Creating audio player for: file:///data/user/0/com.yousef54ai.echoPay/cache/tts_1753921230635.mp3
 LOG  ▶️ Audio playing
 LOG  ⚡ TTS took 1725ms
 LOG  🎤 Voice state changed: {"busy": false, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": false, "voiceState": "speaking"}

```

### Issues Found

-   Issue 1:
-   Issue 2:

---

## Test 1.4: Greeting + Balance

### Expected Behavior

-   User says: "السلام عليكم كم مجموع رصيدي؟"
-   Should respond to balance part, ignore greeting
-   Should be concise

### Test Steps

1. Say: "السلام عليكم كم مجموع رصيدي؟"
2. Expect: Total balance response
3. Verify: No unnecessary greeting response

### Success Criteria

-   [ ] Focuses on balance request
-   [ ] Ignores greeting politely
-   [ ] Concise total balance

### Logs

```
Android Bundled 73ms node_modules/expo-router/entry.js (1 module)
 LOG  ✅ Audio session configured
 LOG  🎤 Voice state changed: {"busy": false, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": false, "voiceState": "idle"}
 LOG  🎙️ Button pressed - Current state: idle Busy: false
 LOG  🎙️ Button PRESSED (1753921270289)
 LOG  🎯 STT: Starting listening session
 LOG  🔄 Voice session reset
 LOG  🔄 STT Processing = TRUE (1753921270297)
 LOG  ✅ Started listening
 LOG  🎤 Voice state changed: {"busy": false, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": true, "voiceState": "listening"}
 LOG  ✅ STT engine started
 LOG  🎙️ STT engine started listening
 LOG  🎤 Voice state changed: {"busy": false, "finalTextLength": 0, "isButtonHeld": false, "isListening": true, "isSTTProcessing": true, "voiceState": "listening"}
 LOG  🎙️ STT (FINAL): السلام عليكم
 LOG  🎯 STT: Got final segment, accumulating: السلام عليكم
 LOG  📝 Accumulated text: السلام عليكم...
 LOG  🎯 Final Text Updated: "السلام عليكم" (1753921273439)
 LOG  ⏳ STT segment complete, waiting for button release...
 LOG  🎤 Voice state changed: {"busy": false, "finalTextLength": 12, "isButtonHeld": false, "isListening": true, "isSTTProcessing": true, "voiceState": "listening"}
 LOG  🎙️ STT (FINAL):  كم مجموع رصيدي
 LOG  🎯 STT: Got final segment, accumulating:  كم مجموع رصيدي
 LOG  📝 Accumulated text: السلام عليكم  كم مجموع رصيدي...
 LOG  🎯 Final Text Updated: "السلام عليكم  كم مجموع رصيدي" (1753921278305)
 LOG  ⏳ STT segment complete, waiting for button release...
 LOG  🎤 Voice state changed: {"busy": false, "finalTextLength": 28, "isButtonHeld": false, "isListening": true, "isSTTProcessing": true, "voiceState": "listening"}
 LOG  🎙️ Button release event - Current state: listening Hold duration: 8920ms
 LOG  ✅ Accepting button release
 LOG  🎙️ Button RELEASED (1753921279209)
 LOG  🎯 STT: Stopping listening session
 LOG  ✅ Stopped listening
 LOG  🎯 Button released - marking STT processing complete
 LOG  🔄 STT Processing = FALSE (1753921279211)
 LOG  🎤 Voice state changed: {"busy": false, "finalTextLength": 28, "isButtonHeld": false, "isListening": true, "isSTTProcessing": false, "voiceState": "listening"}
 LOG  🔄 State changed to processing conditions - triggering checkAndProcess
 LOG  🔍 CheckAndProcess called (1753921279227): {"hasText": true, "isButtonHeld": false, "isSTTProcessing": false, "textLength": 28, "textPreview": "السلام عليكم  كم مجم"}
 LOG  ✅ PROCESSING COMMAND: "السلام عليكم  كم مجموع رصيدي" (1753921279227)
 LOG  🚀 Starting parallel LLM execution
 LOG  🧠 SmartLLM System Prompt Length: 7919
 LOG  🧠 SmartLLM System Prompt (first 300 chars): You are Echo, a Saudi banking assistant. Help users with banking operations using their data.

# RESPONSE TYPES:

**info** - When user asks about their data (balance, transactions, bills list)
- Include full details in response text
- Use Arabic words for numbers in response

**bill_selection** - Wh...
 LOG  🧠 SmartLLM System Prompt contains bills data: true
 LOG  🧠 SmartLLM Bills section (first 200 chars): Bills: [
  {
    "id": "bill_001",
    "provider": "شركة الكهرباء السعودية",
    "type": "كهرباء",
    "amount": 286,
    "dueDate": "2024-01-20",
    "status": "مستحقة",
    "accountNumber": "1234567...
 LOG  🧠 SmartLLM Conversation History:
 LOG    user: "السلام عليكم  كم مجموع رصيدي"
 LOG  🧠 SmartLLM Total Messages: 1
 LOG  🧠 SmartLLM Latest User Message: السلام عليكم  كم مجموع رصيدي
 LOG  🎤 Voice state changed: {"busy": true, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": false, "voiceState": "processing"}
 LOG  🔚 STT engine ended
 LOG  ⏳ STT engine ended, waiting for button release to complete processing
 LOG  ✅ FastLLM categorized as: balance_check
 LOG  ⚡ FastLLM took 1046ms
 LOG  ⚡ FastLLM completed in 1048ms
 LOG  🎵 Playing filler audio: balance_check
 LOG  ✅ Found content in Claude response
 LOG  🧠 Claude Raw Response: {
  "type": "info",
  "response": "مجموع رصيدك ثمانية عشر ألف ومئة وأربعة عشر ريال",
  "actionData": {
    "checking_balance": 5263,
    "savings_balance": 12851,
    "total_balance": 18114
  }
}
 LOG  🧠 Claude Parsed Response Type: info
 LOG  🧠 Claude Parsed Response Text: مجموع رصيدك ثمانية عشر ألف ومئة وأربعة عشر ريال
 LOG  ⚡ SmartLLM (Claude) took 4317ms
 LOG  🧠 SmartLLM completed in 4326ms total
 LOG  🗣️ TTS start: مجموع رصيدك ثمانية عشر ألف ومئة وأربعة عشر ريال
 LOG  🎤 Voice state changed: {"busy": true, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": false, "voiceState": "speaking"}
 LOG  ✅ TTS generated
 LOG  🎵 Creating audio player for: file:///data/user/0/com.yousef54ai.echoPay/cache/tts_1753921285232.mp3
 LOG  ▶️ Audio playing
 LOG  ⚡ TTS took 1688ms
 LOG  🎤 Voice state changed: {"busy": false, "finalTextLength": 0, "isButtonHeld": false, "isListening": false, "isSTTProcessing": false, "voiceState": "speaking"}
```

### Issues Found

-   Issue 1:
-   Issue 2:
