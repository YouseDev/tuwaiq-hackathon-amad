# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EchoPay is a React Native banking app with voice assistant capabilities built with Expo. The app supports Arabic speech-to-text interaction for banking operations and uses external AI services for natural language processing and text-to-speech responses.

## Development Commands

### Main Development
- `npm start` - Start Expo development server
- `expo run:android` - Run on Android device/emulator  
- `expo run:ios` - Run on iOS device/simulator
- `expo start --web` - Run web version

### Build Commands
- `cd echoPay/android && ./gradlew assembleRelease && cd ..` - Build Android APK
- `cd echoPay/ios && xcodebuild -workspace echoPay.xcworkspace -scheme echoPay -configuration Release -derivedDataPath build` - Build iOS

### Development Installation
- `npm run dev-install` - Uninstall and reinstall Android debug build
- `npm run dev-install-ios` - Uninstall and reinstall iOS debug build

### Code Quality
- `expo lint` - Run ESLint

## Architecture

### Core Structure
- **echoPay/app/** - Main application code
  - **components/** - React components (BalanceSection, BillsSection, etc.)
  - **services/** - Core services (LLMService, STTService, TTSService)
  - **types/** - TypeScript type definitions
  - **helpers/** - Utility functions

### Key Services

#### LLMService (`app/services/LLMService.ts`)
- Singleton service for OpenAI o4-mini API integration
- Processes chat history and returns structured responses
- Handles Arabic banking queries with fallback error handling
- Returns typed responses: `{ type: "info" | "action" | "ignore", response: string, fillerAudio?: string, needsOTP?: boolean, actionData?: any }`

#### STTService (`app/services/STTService.ts`) 
- React hook for Arabic speech recognition (ar-SA locale)
- Uses expo-speech-recognition with continuous listening mode
- Returns transcript, confidence level, and error states

#### TTSService (`app/services/TTSService.ts`)
- Singleton service for ElevenLabs text-to-speech
- Generates and plays Arabic audio responses
- Handles audio session configuration and cleanup

### External Dependencies
- **Expo SDK 53** - Core React Native framework
- **NativeWind** - Tailwind CSS for React Native styling  
- **React Navigation** - Navigation with bottom tabs
- **expo-speech-recognition** - Speech-to-text functionality
- **expo-audio** - Audio playback for TTS

### Required Environment Variables
```
EXPO_PUBLIC_OPENAI_KEY - OpenAI API key for LLM service
EXPO_PUBLIC_ELEVENLABS_API_KEY - ElevenLabs API key for TTS
EXPO_PUBLIC_ELEVENLABS_VOICE_ID - Voice ID for TTS generation
```

### Platform-Specific Notes
- Android: Uses Gradle build system, requires SDK setup
- iOS: Uses Xcode workspace, requires CocoaPods
- Both platforms require microphone permissions for STT functionality

### Banking Data
- Mock banking data stored in `assets/data/banking_data.json`
- Types defined in `app/types/core.ts` (BankingContext interface)
- Includes user accounts, credit cards, transactions, bills, and contacts