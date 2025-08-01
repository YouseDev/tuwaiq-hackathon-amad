# EchoPay Developer Documentation 🔧

> **Comprehensive technical guide for developers working on EchoPay**

This document provides in-depth technical information about EchoPay's architecture, implementation details, and development workflow for software engineers and technical contributors.

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Tech Stack & Dependencies](#tech-stack--dependencies)
3. [Project Structure](#project-structure)
4. [Core Services](#core-services)
5. [State Management](#state-management)
6. [API Integrations](#api-integrations)
7. [Development Setup](#development-setup)
8. [Build & Deployment](#build--deployment)
9. [Testing](#testing)
10. [Security Implementation](#security-implementation)
11. [Performance Optimization](#performance-optimization)
12. [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        EchoPay App                          │
├─────────────────────────────────────────────────────────────┤
│  React Native (Expo) - Cross-Platform Mobile Framework     │
├─────────────────────────────────────────────────────────────┤
│                   Presentation Layer                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │  Voice Screen   │  │  Account Screen │  │ Bills Screen │ │
│  │  (assistant.tsx)│  │                 │  │              │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    Business Logic Layer                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   LLM Service   │  │   STT Service   │  │  TTS Service │ │
│  │ (Claude + GPT)  │  │ (Speech-to-Text)│  │(ElevenLabs)  │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                      Data Layer                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ React Context   │  │  Local Storage  │  │  Mock Data   │ │
│  │ (State Mgmt)    │  │                 │  │ (JSON Files) │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    External Services                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │  Anthropic API  │  │   OpenAI API    │  │ ElevenLabs   │ │
│  │ (Claude Sonnet) │  │   (GPT Models)  │  │     API      │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

#### 1. **Dual-LLM Strategy** ⭐
**Innovation Highlight**: EchoPay uses two AI models simultaneously for optimal UX:

- **FastLLM (GPT-4.1-nano)**: Instant command categorization and filler audio selection
- **SmartLLM (Claude Sonnet 4)**: Comprehensive banking logic and Arabic language processing

```typescript
// Parallel execution for minimal latency
const [fillerResponse, smartResponse] = await Promise.all([
    fastLLMService.categorizeCommand(transcript),
    llmService.processQuery(transcript, context)
]);
```

#### 2. **Voice-First Design Pattern**
- **State-Driven UI**: Interface adapts based on voice interaction state
- **Visual Feedback**: Real-time voice wave visualization and status indicators
- **Audio-Centric UX**: Every action confirmed through Arabic TTS

#### 3. **Context-Aware Banking Intelligence**
- **Conversational Memory**: Maintains conversation history for natural flow
- **Banking Domain Specialization**: Optimized prompts for Saudi banking operations
- **Multi-Turn Interactions**: Handles complex banking workflows through voice

---

## 🛠️ Tech Stack & Dependencies

### Core Framework
```json
{
  "expo": "^53.0.19",
  "react": "19.0.0",
  "react-native": "0.79.5",
  "@expo/router": "^3.6.2"
}
```

### AI & Voice Processing
```json
{
  "expo-speech-recognition": "^1.0.6",
  "expo-audio": "~13.10.6",
  "@anthropic-ai/sdk": "^0.30.1",
  "openai": "^4.79.1"
}
```

### State Management & UI
```json
{
  "nativewind": "4.1.17",
  "react-native-reanimated": "~3.17.0",
  "react-native-svg": "15.9.0",
  "@react-native-async-storage/async-storage": "1.24.0"
}
```

### Development Tools
```json
{
  "typescript": "^5.8.4",
  "@types/react": "~19.0.14",
  "eslint": "^8.57.0"
}
```

---

## 📁 Project Structure

```
echoPay/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Bottom tab navigation
│   │   ├── accounts.tsx          # Account overview screen
│   │   ├── assistant.tsx         # Main voice assistant (1,800+ lines)
│   │   ├── bills.tsx             # Bills management
│   │   ├── cards.tsx             # Credit card management
│   │   └── transactions.tsx      # Transaction history
│   ├── _layout.tsx               # Root layout with providers
│   └── +not-found.tsx            # 404 error screen
├── components/                   # Reusable UI components
│   ├── AccountsSection.tsx       # Account balance display
│   ├── BalanceSection.tsx        # Balance card component
│   ├── BillsSection.tsx          # Bills list component
│   ├── CardsSection.tsx          # Credit cards display
│   └── TransactionsSection.tsx   # Transaction list
├── context/                      # React Context providers
│   ├── AccountContext.tsx        # Account state management
│   ├── BillsContext.tsx          # Bills state management
│   ├── CardContext.tsx           # Card operations state
│   ├── TransactionContext.tsx    # Transaction history
│   └── VoiceContext.tsx          # Voice interaction state
├── services/                     # Business logic layer
│   ├── LLMService.ts             # Claude Sonnet 4 integration
│   ├── FastLLMService.ts         # GPT-4.1-nano for instant responses
│   ├── PaymentService.ts         # Payment processing logic
│   ├── STTService.ts             # Speech-to-text processing
│   └── TTSService.ts             # Text-to-speech synthesis
├── types/                        # TypeScript definitions
│   └── core.ts                   # Banking data types
├── helpers/                      # Utility functions
│   └── tools.ts                  # LLM prompts and audio configuration
├── assets/                       # Static resources
│   ├── audio/                    # Filler audio files
│   ├── data/                     # Mock banking data
│   └── images/                   # UI assets
├── app.json                      # Expo configuration
├── package.json                  # Dependencies
└── tailwind.config.js            # NativeWind configuration
```

---

## 🔧 Core Services

### 1. LLMService.ts - Banking Intelligence

**Primary Responsibilities:**
- Claude Sonnet 4 API integration for advanced Arabic NLP
- Banking operation processing and validation
- Conversational context management
- Structured JSON response generation

```typescript
interface LLMResponse {
  type: "info" | "bill_selection" | "bill_payment" | "transfer_selection" | 
        "transfer_payment" | "card_security";
  response: string;
  actionData?: any;
  fillerAudio?: string;
  needsOTP?: boolean;
}
```

**Key Features:**
- **Token Budget Management**: Automatic conversation history trimming
- **Arabic Number Processing**: Converts Arabic text numbers to integers
- **Banking Workflow Support**: Handles multi-step transactions
- **Error Recovery**: Fallback responses for API failures

```typescript
class LLMService {
  private anthropic: Anthropic;
  private conversationHistory: Array<{role: string, content: string}> = [];
  
  async processQuery(transcript: string, context: BankingContext): Promise<LLMResponse> {
    try {
      // Build banking-specific prompt with user data
      const prompt = buildPrompt(context);
      
      // Add user message to conversation
      this.conversationHistory.push({
        role: "user", 
        content: transcript
      });
      
      // Trim history if exceeding token budget
      this.trimHistoryIfNeeded();
      
      // Claude API call with conversation context
      const completion = await this.anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4096,
        messages: [
          { role: "user", content: prompt },
          ...this.conversationHistory
        ]
      });
      
      return JSON.parse(completion.content[0].text);
    } catch (error) {
      return this.getFallbackResponse();
    }
  }
}
```

### 2. STTService.ts - Arabic Speech Recognition

**Hook-Based Architecture:**
```typescript
export function useSTTService() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const startListening = useCallback(async () => {
    try {
      await SpeechRecognition.requestPermissionsAsync();
      
      await SpeechRecognition.start({
        language: 'ar-SA',
        interimResults: true,
        continuous: true,
        maxDuration: 30000
      });
      
      setIsListening(true);
    } catch (err) {
      setError(err.message);
    }
  }, []);
  
  return { 
    transcript, 
    isListening, 
    error, 
    startListening, 
    stopListening 
  };
}
```

**Features:**
- **Arabic Locale Support**: Optimized for Saudi Arabic (ar-SA)
- **Continuous Recognition**: Real-time transcript updates
- **Permission Management**: Automatic microphone permission handling
- **Error Recovery**: Robust error handling with user feedback

### 3. TTSService.ts - Arabic Voice Synthesis

**Singleton Service for Audio Management:**
```typescript
class TTSService {
  private static instance: TTSService | null = null;
  private currentAudio: Audio.Sound | null = null;
  
  async playText(text: string): Promise<void> {
    try {
      // Generate audio via ElevenLabs API
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });
      
      // Convert to base64 and play
      const audioBuffer = await response.arrayBuffer();
      const base64Audio = this.arrayBufferToBase64(audioBuffer);
      
      const { sound } = await Audio.Sound.createAsync(
        { uri: `data:audio/mpeg;base64,${base64Audio}` },
        { shouldPlay: true }
      );
      
      this.currentAudio = sound;
    } catch (error) {
      console.error('TTS Error:', error);
    }
  }
}
```

### 4. FastLLMService.ts - Instant Response System

**Innovation**: Parallel processing for immediate user feedback
```typescript
class FastLLMService {
  async categorizeCommand(transcript: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4-1106-preview", // Ultra-fast nano model
      messages: [{
        role: "user",
        content: `Categorize this Arabic banking command: "${transcript}"\nReturn one of: balance_check, transaction_search, transfer_payment, general_request`
      }],
      max_tokens: 10,
      temperature: 0
    });
    
    return response.choices[0].message.content.trim();
  }
}
```

---

## 🗂️ State Management

### React Context Architecture

EchoPay uses React Context for centralized state management:

#### 1. VoiceContext - Voice Interaction State
```typescript
interface VoiceContextType {
  isListening: boolean;
  transcript: string;
  isProcessing: boolean;
  response: string;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  processTranscript: (text: string) => Promise<void>;
}
```

#### 2. AccountContext - Banking Account Management
```typescript
interface AccountContextType {
  accounts: Account[];
  currentAccount: Account | null;
  updateBalance: (accountId: string, newBalance: number) => void;
  switchAccount: (accountId: string) => void;
}
```

#### 3. BillsContext - Bill Payment State
```typescript
interface BillsContextType {
  bills: Bill[];
  payBill: (billId: string, amount: number) => Promise<void>;
  getBillsByProvider: (provider: string) => Bill[];
  markBillAsPaid: (billId: string) => void;
}
```

### Context Provider Setup
```typescript
// app/_layout.tsx
export default function RootLayout() {
  return (
    <AccountProvider>
      <VoiceProvider>
        <BillsProvider>
          <CardProvider>
            <TransactionProvider>
              {/* App content */}
            </TransactionProvider>
          </CardProvider>
        </BillsProvider>
      </VoiceProvider>
    </AccountProvider>
  );
}
```

---

## 🔌 API Integrations

### 1. Anthropic API (Claude Sonnet 4)
```typescript
// Configuration
const anthropic = new Anthropic({
  apiKey: process.env.EXPO_PUBLIC_ANTHROPIC_KEY,
  dangerouslyAllowBrowser: true // Required for Expo
});

// Request structure
const response = await anthropic.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 4096,
  temperature: 0.1,
  messages: [
    { role: "user", content: bankingPrompt }
  ]
});
```

### 2. OpenAI API (GPT Models)
```typescript
// FastLLM service configuration
const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_KEY,
  dangerouslyAllowBrowser: true
});

// Ultra-fast categorization
const completion = await openai.chat.completions.create({
  model: "gpt-4-1106-preview",
  messages: [{ role: "user", content: categorizationPrompt }],
  max_tokens: 10,
  temperature: 0
});
```

### 3. ElevenLabs TTS API
```typescript
// Voice synthesis configuration
const ttsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
  method: 'POST',
  headers: {
    'Accept': 'audio/mpeg',
    'Content-Type': 'application/json',
    'xi-api-key': process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY
  },
  body: JSON.stringify({
    text: arabicText,
    model_id: 'eleven_multilingual_v2',
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.5,
      style: 0.0,
      use_speaker_boost: true
    }
  })
});
```

---

## 🚀 Development Setup

### Prerequisites
```bash
# Required versions
node >= 18.0.0
npm >= 8.0.0
expo-cli >= 6.0.0

# Optional (for device testing)
ios-simulator (macOS only)
android-studio + emulator
```

### Initial Setup
```bash
# 1. Clone repository
git clone <repository-url>
cd hackathon

# 2. Install dependencies
npm install

# 3. Install Expo CLI globally
npm install -g @expo/cli
```

### Environment Configuration
Create `.env` file in project root:
```env
# AI Services
EXPO_PUBLIC_OPENAI_KEY=your_openai_api_key
EXPO_PUBLIC_ANTHROPIC_KEY=your_anthropic_api_key

# Text-to-Speech
EXPO_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_api_key
EXPO_PUBLIC_ELEVENLABS_VOICE_ID=your_voice_id

# Optional: Development flags
EXPO_PUBLIC_DEBUG_MODE=true
EXPO_PUBLIC_MOCK_APIS=false
```

### Development Commands
```bash
# Start development server
npm start
# or
expo start

# Run on specific platforms
expo run:ios       # iOS simulator/device
expo run:android   # Android emulator/device
expo start --web   # Web browser (limited features)

# Development utilities
npm run lint       # ESLint code checking
expo install --fix # Fix dependency compatibility
expo doctor        # Diagnose setup issues
```

---

## 🏗️ Build & Deployment

### Build Commands

#### Development Builds
```bash
# Android Development
cd echoPay/android && ./gradlew assembleDebug && cd ..
npm run dev-install  # Uninstall + install debug APK

# iOS Development  
cd echoPay/ios && xcodebuild -workspace echoPay.xcworkspace -scheme echoPay -configuration Debug -derivedDataPath build
npm run dev-install-ios
```

#### Production Builds
```bash
# Android Production
cd echoPay/android && ./gradlew assembleRelease && cd ..

# iOS Production
cd echoPay/ios && xcodebuild -workspace echoPay.xcworkspace -scheme echoPay -configuration Release -derivedDataPath build
```

### Expo Build Service (EAS)
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for different platforms
eas build --platform android
eas build --platform ios
eas build --platform all

# Submit to app stores
eas submit --platform android
eas submit --platform ios
```

### Build Configuration (app.json)
```json
{
  "expo": {
    "name": "EchoPay",
    "slug": "echopay",
    "version": "1.0.0",
    "platforms": ["ios", "android"],
    "plugins": [
      "expo-speech-recognition",
      "expo-audio"
    ],
    "permissions": [
      "RECORD_AUDIO",
      "MODIFY_AUDIO_SETTINGS"
    ]
  }
}
```

---

## 🧪 Testing

### Current Testing Status
⚠️ **Critical Gap**: No test files currently exist in the codebase

### Recommended Testing Strategy

#### 1. Unit Tests (Jest + React Native Testing Library)
```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native
```

**Service Testing Example:**
```typescript
// __tests__/services/LLMService.test.ts
import LLMService from '../services/LLMService';

describe('LLMService', () => {
  it('should process Arabic banking queries', async () => {
    const service = LLMService.getInstance();
    const response = await service.processQuery('كم رصيدي؟', mockContext);
    
    expect(response.type).toBe('info');
    expect(response.response).toContain('رصيد');
  });
});
```

#### 2. Integration Tests
```typescript
// __tests__/integration/VoiceBanking.test.ts
describe('Voice Banking Flow', () => {
  it('should complete bill payment via voice', async () => {
    // Mock STT service
    mockSTT.mockResolvedValue('ابي اسدد فاتورة الكهرباء');
    
    // Trigger voice interaction
    const result = await voiceHandler.processCommand();
    
    expect(result.success).toBe(true);
    expect(mockTTS).toHaveBeenCalledWith(expect.stringContaining('تم دفع'));
  });
});
```

#### 3. E2E Testing (Detox)
```bash
# Install Detox
npm install --save-dev detox
```

```typescript
// e2e/VoiceAssistant.e2e.ts  
describe('Voice Assistant E2E', () => {
  it('should navigate to voice screen and process command', async () => {
    await element(by.id('voice-tab')).tap();
    await element(by.id('listen-button')).tap();
    await expect(element(by.id('listening-indicator'))).toBeVisible();
  });
});
```

### Test Configuration
```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "e2e:ios": "detox test --configuration ios.sim.debug",
    "e2e:android": "detox test --configuration android.emu.debug"
  }
}
```

---

## 🔒 Security Implementation

### Current Security Measures

#### 1. API Key Protection
```typescript
// Environment variable usage
const OPENAI_KEY = process.env.EXPO_PUBLIC_OPENAI_KEY;
const ANTHROPIC_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_KEY;

// API key validation
if (!OPENAI_KEY) {
  throw new Error('OpenAI API key not configured');
}
```

#### 2. Mock Data Security
```typescript
// assets/data/banking_data.json - Demo data only
{
  "user": {
    "name": "أحمد محمد العلي",
    "accountNumber": "SA44 0000 0000 0000 0000",
    // No real banking credentials
  }
}
```

#### 3. Transaction Validation
```typescript
// Payment confirmation required
if (response.type === 'bill_payment') {
  const confirmation = await confirmTransaction(actionData);
  if (!confirmation) {
    throw new Error('Transaction cancelled by user');
  }
}
```

### Production Security Requirements

#### 1. Authentication System
```typescript
// Voice biometric authentication (planned)
interface VoiceAuth {
  enrollVoiceprint: (userId: string) => Promise<string>;
  verifyVoice: (audioSample: ArrayBuffer) => Promise<boolean>;
  updateVoiceprint: (userId: string, newSample: ArrayBuffer) => Promise<void>;
}
```

#### 2. Data Encryption
```typescript
// Sensitive data encryption (required for production)
import CryptoJS from 'crypto-js';

const encryptData = (data: string, key: string): string => {
  return CryptoJS.AES.encrypt(data, key).toString();
};

const decryptData = (encryptedData: string, key: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};
```

#### 3. API Security
```typescript
// Request signing (planned)
const signRequest = (payload: string, secret: string): string => {
  return CryptoJS.HmacSHA256(payload, secret).toString();
};
```

---

## ⚡ Performance Optimization

### Current Optimizations

#### 1. Dual-LLM Strategy
- **FastLLM**: Immediate user feedback (<500ms)
- **SmartLLM**: Comprehensive processing (1-2s)
- **Parallel Execution**: Both APIs called simultaneously

#### 2. Audio Optimization
```typescript
// Efficient audio handling without Buffer dependency
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};
```

#### 3. Context Management
```typescript
// Token budget management to prevent API limits
private trimHistoryIfNeeded(): void {
  const totalTokens = this.estimateTokens();
  if (totalTokens > MAX_TOKENS) {
    this.conversationHistory = this.conversationHistory.slice(-5);
  }
}
```

### Additional Optimization Opportunities

#### 1. React Optimization
```typescript
// Memoization for expensive components
const VoiceVisualization = React.memo(({ amplitude }: { amplitude: number }) => {
  return <AnimatedWave amplitude={amplitude} />;
});

// Callback optimization
const handleVoiceInput = useCallback(async (transcript: string) => {
  await processVoiceCommand(transcript);
}, []);
```

#### 2. Bundle Optimization
```json
// metro.config.js - Tree shaking
module.exports = {
  resolver: {
    alias: {
      'crypto': 'crypto-browserify',
      'stream': 'stream-browserify'
    }
  }
};
```

#### 3. Lazy Loading
```typescript
// Dynamic imports for heavy components
const VoiceAssistant = lazy(() => import('./assistant'));
```

---

## 🐛 Troubleshooting

### Common Development Issues

#### 1. Microphone Permission Errors
```bash
# iOS Simulator Issue
# Problem: Speech recognition not working in iOS simulator
# Solution: Test on physical device - simulator doesn't have microphone access

# Android Permission Issue  
# Problem: RECORD_AUDIO permission denied
# Solution: Add to app.json
"permissions": ["RECORD_AUDIO"]
```

#### 2. API Integration Issues
```typescript
// OpenAI API Error Handling
try {
  const response = await openai.chat.completions.create({...});
} catch (error) {
  if (error.code === 'rate_limit_exceeded') {
    // Handle rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
    return this.retryRequest();
  }
  throw error;
}
```

#### 3. Audio Playback Issues
```bash
# iOS Audio Session
# Problem: Audio not playing on iOS
# Solution: Configure audio session properly
await Audio.setAudioModeAsync({
  allowsRecordingIOS: false,
  staysActiveInBackground: false,
  playsInSilentModeIOS: true,
  shouldDuckAndroid: true,
  playThroughEarpieceAndroid: false
});
```

#### 4. Build Errors
```bash
# Metro bundler cache issues
npx expo start --clear

# iOS CocoaPods issues
cd ios && pod deintegrate && pod install && cd ..

# Android Gradle issues
cd android && ./gradlew clean && cd ..
```

### Debug Tools

#### 1. Console Logging
```typescript
// Comprehensive logging throughout services
console.log('[LLMService] Processing query:', transcript);
console.log('[STTService] Recognition result:', result);
console.log('[TTSService] Playing audio:', text.substring(0, 50));
```

#### 2. React Developer Tools
```bash
# Install React DevTools
npm install -g react-devtools
react-devtools
```

#### 3. Network Debugging
```bash
# Expo development tools
expo start --devtools
# Opens browser with network inspector
```

---

## 📊 Performance Monitoring

### Metrics to Track

#### 1. Voice Interaction Metrics
```typescript
interface VoiceMetrics {
  speechRecognitionLatency: number;    // STT processing time
  llmProcessingTime: number;           // AI response time
  ttsGenerationTime: number;           // Audio generation time
  totalInteractionTime: number;        // End-to-end time
  recognitionAccuracy: number;         // Speech recognition confidence
}
```

#### 2. Banking Operation Metrics
```typescript
interface BankingMetrics {
  billPaymentSuccess: number;          // Successful bill payments
  transferSuccess: number;             // Successful transfers  
  voiceAuthSuccess: number;            // Voice authentication rate
  userSatisfactionScore: number;       // User feedback rating
}
```

### Monitoring Implementation
```typescript
// Performance tracking service
class AnalyticsService {
  static trackVoiceInteraction(metrics: VoiceMetrics) {
    // Send to analytics service
    console.log('Voice Metrics:', metrics);
  }
  
  static trackBankingOperation(operation: string, success: boolean) {
    // Track banking operation success rates
    console.log(`Banking Operation: ${operation}, Success: ${success}`);
  }
}
```

---

## 🤝 Contributing Guidelines

### Code Style

#### 1. TypeScript Standards
```typescript
// Use interfaces for object shapes
interface BankingResponse {
  type: ResponseType;
  response: string;
  actionData?: any;
}

// Use enums for constants
enum ResponseType {
  INFO = 'info',
  BILL_PAYMENT = 'bill_payment',
  TRANSFER = 'transfer'
}
```

#### 2. React Patterns
```typescript
// Use functional components with hooks
const VoiceAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  
  const handleVoiceInput = useCallback(async (transcript: string) => {
    // Handle voice input
  }, []);
  
  return (
    <View className="flex-1">
      {/* Component JSX */}
    </View>
  );
};
```

#### 3. Service Patterns
```typescript
// Use singleton pattern for services
class TTSService {
  private static instance: TTSService | null = null;
  
  static getInstance(): TTSService {
    if (!this.instance) {
      this.instance = new TTSService();
    }
    return this.instance;
  }
}
```

### Pull Request Process

1. **Feature Branch**: Create from `main` branch
2. **Comprehensive Testing**: Add unit tests for new features
3. **Documentation**: Update relevant documentation
4. **Code Review**: Minimum 2 reviewer approval
5. **Security Review**: For any banking-related changes

### Development Workflow
```bash
# 1. Create feature branch
git checkout -b feature/voice-authentication

# 2. Make changes and test
npm test
npm run lint

# 3. Commit with clear message
git commit -m "feat: add voice authentication system"

# 4. Push and create PR
git push origin feature/voice-authentication
```

---

## 📈 Future Development Roadmap

### Phase 1: Production Readiness (Q1 2025)
- [ ] Real banking API integration
- [ ] Voice biometric authentication
- [ ] Comprehensive test coverage (>80%)
- [ ] Security audit and penetration testing
- [ ] SAMA regulatory compliance

### Phase 2: Enhanced Features (Q2 2025)
- [ ] Multi-dialect Arabic support
- [ ] Offline voice recognition capability
- [ ] Advanced fraud detection
- [ ] Personalized financial insights
- [ ] Cross-platform synchronization

### Phase 3: Scale & Expansion (Q3-Q4 2025)
- [ ] Multi-bank integration
- [ ] Regional expansion (UAE, Kuwait, Qatar)
- [ ] Business banking features
- [ ] Investment and savings tools
- [ ] AI-powered financial advisor

---

## 📞 Developer Support

### Getting Help
- **Documentation**: This comprehensive guide
- **Issues**: GitHub issues for bug reports
- **Community**: Developer Discord/Slack channel
- **Code Review**: Pair programming sessions available

### Contact Information
- **Technical Lead**: [Lead Developer Contact]
- **Architecture Questions**: [Architecture Team]
- **Security Concerns**: [Security Team]
- **Performance Issues**: [Performance Team]

---

## 📜 License & Compliance

### Development License
This project is developed for educational and demonstration purposes. All banking data is simulated and no real financial transactions are processed.

### Production Considerations
- **SAMA Compliance**: Required for Saudi banking operations
- **Data Privacy**: GDPR/local privacy law compliance
- **Security Standards**: Banking-grade security implementation
- **Accessibility**: WCAG 2.1 AA compliance for inclusive design

---

**EchoPay Developer Documentation - Version 1.0**

*Built with precision by Team تمكين (Tamkeen) - Engineering accessibility through voice technology* 🔧💙