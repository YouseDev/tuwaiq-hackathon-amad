# TTS Service Documentation

## Overview

The TTS (Text-to-Speech) service is a crucial component of EchoPay that provides Arabic voice responses for visually impaired users and seniors. It implements a two-tier audio architecture for optimal performance and user experience.

## Architecture

### Two-Tier Audio System

1. **Pre-recorded Audio** (~100ms latency)

    - Instant playback for common phrases
    - Stored locally in `assets/audio/`
    - English keys mapped to Arabic audio files
    - Used for: greetings, confirmations, error messages

2. **AI-Generated Audio** (~1000ms latency)
    - Dynamic content via ElevenLabs API
    - Real-time Arabic speech synthesis
    - Used for: account balances, transaction details, dynamic responses

### Core Components

-   **TTSService.ts**: Main service class implementing singleton pattern
-   **audioConfig.ts**: Configuration for pre-recorded audio mappings
-   **Environment Config**: Secure API key and voice settings management

## Configuration

### Environment Variables

Required in `.env` file with `EXPO_PUBLIC_` prefix:

```env
EXPO_PUBLIC_ELEVENLABS_API_KEY=your_api_key_here
EXPO_PUBLIC_ELEVENLABS_VOICE_ID=XpZeqQTuSFEd29ztEE53
EXPO_PUBLIC_ELEVENLABS_API_URL=https://api.elevenlabs.io/v1/text-to-speech
EXPO_PUBLIC_TTS_STABILITY=1.0
EXPO_PUBLIC_TTS_SIMILARITY_BOOST=1.0
EXPO_PUBLIC_TTS_STYLE=0.0
EXPO_PUBLIC_TTS_SPEAKER_BOOST=false
```

### Audio Configuration

Pre-recorded audio mapping in `audioConfig.ts`:

```typescript
export const PRERECORDED_AUDIO = {
    welcome: {
        key: "welcome",
        arabicText: "أهلاً وسهلاً",
        audioFile: require("../../assets/audio/welcome.mp3"),
    },
} as const
```

### ElevenLabs Settings

-   **Voice ID**: `XpZeqQTuSFEd29ztEE53` (Arabic-optimized voice)
-   **Model**: `eleven_multilingual_v2`
-   **Output Format**: `mp3_44100_128` (high quality)
-   **Voice Settings**:
    -   Stability: 1.0 (maximum consistency)
    -   Similarity Boost: 1.0 (voice authenticity)
    -   Style: 0.0 (neutral delivery)
    -   Speaker Boost: false

## Performance Metrics

### Latency Measurements

| Audio Type   | Average Latency | Range      | Use Case        |
| ------------ | --------------- | ---------- | --------------- |
| Pre-recorded | ~100ms          | 50-150ms   | Common phrases  |
| AI-generated | ~1000ms         | 999-1319ms | Dynamic content |

### File Size Analytics

| Duration  | File Size | Compression   |
| --------- | --------- | ------------- |
| 3 seconds | 45KB      | mp3_44100_128 |
| 5 seconds | 87KB      | mp3_44100_128 |

### API Performance

-   **Network Latency**: 999-1319ms (ElevenLabs processing time)
-   **File Processing**: <50ms (base64 conversion + file save)
-   **Audio Loading**: <100ms (expo-audio player initialization)

## Technical Implementation

### Audio Processing Flow

1. **API Call** → ElevenLabs text-to-speech endpoint
2. **Response** → ArrayBuffer containing MP3 data
3. **Conversion** → Base64 encoding for React Native compatibility
4. **File Save** → Temporary file in cache directory
5. **Playback** → expo-audio player with event listeners
6. **Cleanup** → Automatic file deletion after playback

### Error Handling

-   **Missing Config**: Graceful degradation with detailed error logging
-   **Network Failures**: Timeout handling and retry logic
-   **File System Errors**: Cleanup on failure to prevent storage leaks
-   **Audio Player Errors**: Safe state management and resource cleanup

### Memory Management

-   **Singleton Pattern**: Single service instance across app
-   **Automatic Cleanup**: Temporary files deleted after playback
-   **Player Management**: Proper disposal of audio player resources
-   **State Tracking**: `isPlaying` flag prevents concurrent audio conflicts

## Usage Examples

### Pre-recorded Audio

```typescript
import TTSService from "./services/TTSService"

// Play welcome message (instant)
await TTSService.speak("welcome", true)
```

### Dynamic Content

```typescript
// Generate AI speech for account balance
await TTSService.speak("رصيدك الحالي هو ألف ريال سعودي")
```

### Audio Control

```typescript
// Stop current audio
await TTSService.stop()

// Check if audio is playing
const isPlaying = TTSService.getIsPlaying()

// Verify configuration
const isConfigured = TTSService.isConfigured()
const status = TTSService.getConfigStatus()
```

## Logging and Debugging

### Comprehensive Logging

The service includes detailed console logging with emojis for easy debugging:

-   🎤 TTS Service calls
-   📼 Pre-recorded audio operations
-   🤖 AI-generated speech
-   🌐 API requests and responses
-   ✅ Success operations
-   ❌ Error conditions
-   🗑️ Cleanup operations

### Debug Information

Logs include:

-   Request/response timing
-   File sizes and paths
-   API configuration status
-   Audio player state changes
-   Network response details

## Dependencies

### Required Packages

-   `expo-audio`: Audio playback (migrated from deprecated expo-av)
-   `expo-file-system`: File operations and cache management

### API Dependencies

-   **ElevenLabs API**: Text-to-speech generation
-   **Model**: eleven_multilingual_v2 for Arabic support

## Security Considerations

-   API keys stored in environment variables
-   Temporary files in secure cache directory
-   No persistent storage of audio content
-   Automatic cleanup prevents storage accumulation

## Future Enhancements

### Planned Features

1. **Audio Caching**: Intelligent caching for frequently used phrases
2. **Voice Customization**: Multiple voice options for user preference
3. **Speed Control**: Adjustable playback speed for accessibility
4. **Queue Management**: Audio queue for complex responses
5. **Offline Fallback**: Pre-recorded alternatives for network failures

### Performance Optimizations

1. **Batch Processing**: Multiple TTS requests in single API call
2. **Compression**: Optimized audio format selection
3. **Preloading**: Predictive generation for common responses
4. **CDN Integration**: Cached responses via content delivery network

## Troubleshooting

### Common Issues

1. **No Audio Output**

    - Check device volume settings
    - Verify audio permissions
    - Confirm expo-audio installation

2. **API Errors**

    - Validate environment variables
    - Check API key permissions
    - Verify network connectivity

3. **Performance Issues**
    - Monitor network latency
    - Check device storage space
    - Review console logs for bottlenecks

### Debug Commands

```typescript
// Check configuration
console.log(TTSService.getConfigStatus())

// Monitor audio state
console.log(TTSService.getIsPlaying())
```

---

**Last Updated**: January 2025  
**Version**: 1.0  
**Maintainer**: EchoPay Development Team
