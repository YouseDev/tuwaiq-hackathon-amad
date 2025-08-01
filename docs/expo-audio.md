Expo Audio (expo-audio)

A library that provides an API to implement audio playback and recording in apps.

Bundled version:
~0.4.8
expo-audio is a cross-platform audio library for accessing the native audio capabilities of the device.

Note that audio automatically stops if headphones/bluetooth audio devices are disconnected.

Installation
Terminal

Copy

npx expo install expo-audio
If you are installing this in an existing React Native app, make sure to install expo in your project.

Configuration in app config
You can configure expo-audio using its built-in config plugin if you use config plugins in your project (EAS Build or npx expo run:[android|ios]). The plugin allows you to configure various properties that cannot be set at runtime and require building a new app binary to take effect. If your app does not use EAS Build, then you'll need to manually configure the package.

Example app.json with config plugin
app.json

Copy

{
"expo": {
"plugins": [
[
"expo-audio",
{
"microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone."
}
]
]
}
}
Configurable properties
Name Default Description
microphonePermission "Allow $(PRODUCT_NAME) to access your microphone"
Only for:

A string to set the NSMicrophoneUsageDescription permission message.

Usage
Playing sounds
Playing sounds

Copy

Open in Snack

import { View, StyleSheet, Button } from 'react-native';
import { useAudioPlayer } from 'expo-audio';

const audioSource = require('./assets/Hello.mp3');

export default function App() {
const player = useAudioPlayer(audioSource);

return (
<View style={styles.container}>
<Button title="Play Sound" onPress={() => player.play()} />
<Button
title="Replay Sound"
onPress={() => {
player.seekTo(0);
player.play();
}}
/>
</View>
);
}

const styles = StyleSheet.create({
container: {
flex: 1,
justifyContent: 'center',
backgroundColor: '#ecf0f1',
padding: 10,
},
});

Show More
Note: If you're migrating from expo-av, you'll notice that expo-audio doesn't automatically reset the playback position when audio finishes. After play(), the player stays paused at the end of the sound. To play it again, call seekTo(seconds) to reset the position — as shown in the example above.
Recording sounds
Recording sounds

Copy

Open in Snack

import { useState, useEffect } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import {
useAudioRecorder,
AudioModule,
RecordingPresets,
setAudioModeAsync,
useAudioRecorderState,
} from 'expo-audio';

export default function App() {
const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
const recorderState = useAudioRecorderState(audioRecorder);

const record = async () => {
await audioRecorder.prepareToRecordAsync();
audioRecorder.record();
};

const stopRecording = async () => {
// The recording will be available on `audioRecorder.uri`.
await audioRecorder.stop();
};

useEffect(() => {
(async () => {
const status = await AudioModule.requestRecordingPermissionsAsync();
if (!status.granted) {
Alert.alert('Permission to access microphone was denied');
}

      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();

}, []);

return (
<View style={styles.container}>
<Button
title={recorderState.isRecording ? 'Stop Recording' : 'Start Recording'}
onPress={recorderState.isRecording ? stopRecording : record}
/>
</View>
);
}

const styles = StyleSheet.create({
container: {
flex: 1,
justifyContent: 'center',
backgroundColor: '#ecf0f1',
padding: 10,
},
});

Show More
Playing or recording audio in background 
On iOS, audio playback and recording in background is only available in standalone apps, and it requires some extra configuration. On iOS, each background feature requires a special key in UIBackgroundModes array in your Info.plist file. In standalone apps this array is empty by default, so to use background features you will need to add appropriate keys to your app.json configuration.

See an example of app.json that enables audio playback in background:

{
"expo": {
...
"ios": {
...
"infoPlist": {
...
"UIBackgroundModes": [
"audio"
]
}
}
}
}
Using the AudioPlayer directly
In most cases, the useAudioPlayer hook should be used to create a AudioPlayer instance. It manages the player's lifecycle and ensures that it is properly disposed of when the component is unmounted. However, in some advanced use cases, it might be necessary to create a AudioPlayer that does not get automatically destroyed when the component is unmounted. In those cases, the AudioPlayer can be created using the createAudioPlayer function. You need be aware of the risks that come with this approach, as it is your responsibility to call the release() method when the player is no longer needed. If not handled properly, this approach may lead to memory leaks.

import { createAudioPlayer } from 'expo-audio';
const player = createAudioPlayer(audioSource);
Notes on web usage
A MediaRecorder issue on Chrome produces WebM files missing the duration metadata. See the open Chromium issue.
MediaRecorder encoding options and other configurations are inconsistent across browsers, utilizing a Polyfill such as kbumsik/opus-media-recorder or ai/audio-recorder-polyfill in your application will improve your experience. Any options passed to prepareToRecordAsync will be passed directly to the MediaRecorder API and as such the polyfill.
Web browsers require sites to be served securely for them to listen to a mic. See MediaDevices getUserMedia() security for more details.
API
import { useAudioPlayer, useAudioRecorder } from 'expo-audio';
Constants
Audio.AUDIO_SAMPLE_UPDATE
Type: 'audioSampleUpdate'

Audio.PLAYBACK_STATUS_UPDATE
Type: 'playbackStatusUpdate'

Audio.RECORDING_STATUS_UPDATE
Type: 'recordingStatusUpdate'

Audio.RecordingPresets
Type: Record<string, RecordingOptions>

Constant which contains definitions of the two preset examples of RecordingOptions, as implemented in the Audio SDK.

HIGH_QUALITY
RecordingPresets.HIGH_QUALITY = {
extension: '.m4a',
sampleRate: 44100,
numberOfChannels: 2,
bitRate: 128000,
android: {
outputFormat: 'mpeg4',
audioEncoder: 'aac',
},
ios: {
outputFormat: IOSOutputFormat.MPEG4AAC,
audioQuality: AudioQuality.MAX,
linearPCMBitDepth: 16,
linearPCMIsBigEndian: false,
linearPCMIsFloat: false,
},
web: {
mimeType: 'audio/webm',
bitsPerSecond: 128000,
},
};

Show More
LOW_QUALITY
RecordingPresets.LOW_QUALITY = {
extension: '.m4a',
sampleRate: 44100,
numberOfChannels: 2,
bitRate: 64000,
android: {
extension: '.3gp',
outputFormat: '3gp',
audioEncoder: 'amr_nb',
},
ios: {
audioQuality: AudioQuality.MIN,
outputFormat: IOSOutputFormat.MPEG4AAC,
linearPCMBitDepth: 16,
linearPCMIsBigEndian: false,
linearPCMIsFloat: false,
},
web: {
mimeType: 'audio/webm',
bitsPerSecond: 128000,
},
};

Show More
Hooks
useAudioPlayer(source, updateInterval)
Parameter Type
source
(optional)
AudioSource
updateInterval
(optional)
number

Returns:
AudioPlayer
useAudioPlayerStatus(player)
Parameter Type
player AudioPlayer

Returns:
AudioStatus
useAudioRecorder(options, statusListener)
Parameter Type
options RecordingOptions
statusListener
(optional)
(status: RecordingStatus) => void

Returns:
AudioRecorder
useAudioRecorderState(recorder, interval)
Parameter Type
recorder AudioRecorder
interval
(optional)
number

Returns:
RecorderState
useAudioSampleListener(player, listener)
Parameter Type
player AudioPlayer
listener (data: AudioSample) => void

Returns:
void
Classes
AudioPlayer
Type: Class extends SharedObject<AudioEvents>

AudioPlayer Properties

currentTime
Type: number
The current position through the audio item in seconds.

duration
Type: number
The total duration of the audio in seconds.

id
Type: number
Unique identifier for the player object.

isAudioSamplingSupported
Type: boolean
Boolean value indicating whether audio sampling is supported on the platform.

isBuffering
Type: boolean
Boolean value indicating whether the player is buffering.

isLoaded
Type: boolean
Boolean value indicating whether the player is finished loading.

loop
Type: boolean
Boolean value indicating whether the player is currently looping.

muted
Type: boolean
Boolean value indicating whether the player is currently muted.

paused
Type: boolean
Boolean value indicating whether the player is currently paused.

playbackRate
Type: number
The current playback rate of the audio.

playing
Type: boolean
Boolean value indicating whether the player is currently playing.

shouldCorrectPitch
Type: boolean
A boolean describing if we are correcting the pitch for a changed rate.

volume
Type: number
The current volume of the audio.

AudioPlayer Methods

pause()
Pauses the player.

Returns:
void
play()
Start playing audio.

Returns:
void
remove()
Remove the player from memory to free up resources.

Returns:
void
replace(source)
Parameter Type
source AudioSource

Replaces the current audio source with a new one.

Returns:
void
seekTo(seconds)
Parameter Type Description
seconds number
The number of seconds to seek by.

Seeks the playback by the given number of seconds.

Returns:
Promise<void>
setPlaybackRate(rate, pitchCorrectionQuality)
Parameter Type Description
rate number
The playback rate of the audio.

pitchCorrectionQuality
(optional)
PitchCorrectionQuality
The quality of the pitch correction.

Sets the current playback rate of the audio.

Returns:
void
AudioRecorder
Type: Class extends SharedObject<RecordingEvents>

AudioRecorder Properties

currentTime
Type: number
The current length of the recording, in seconds.

id
Type: number
Unique identifier for the recorder object.

isRecording
Type: boolean
Boolean value indicating whether the recording is in progress.

uri
Literal type: union
The uri of the recording.

Acceptable values are: null | string

AudioRecorder Methods

getAvailableInputs()
Returns a list of available recording inputs. This method can only be called if the Recording has been prepared.

Returns:
RecordingInput[]
A Promise that is fulfilled with an array of RecordingInput objects.

getCurrentInput()
Returns the currently-selected recording input. This method can only be called if the Recording has been prepared.

Returns:
RecordingInput
A Promise that is fulfilled with a RecordingInput object.

getStatus()
Status of the current recording.

Returns:
RecorderState
pause()
Pause the recording.

Returns:
void
prepareToRecordAsync(options)
Parameter Type
options
(optional)
Partial<RecordingOptions>

Prepares the recording for recording.

Returns:
Promise<void>
record()
Starts the recording.

Returns:
void
recordForDuration(seconds)
Parameter Type Description
seconds number
The time in seconds to stop recording at.

Stops the recording once the specified time has elapsed.

Returns:
void
setInput(inputUid)
Parameter Type Description
inputUid string
The uid of a RecordingInput.

Sets the current recording input.

Returns:
void
A Promise that is resolved if successful or rejected if not.

startRecordingAtTime(seconds)
Parameter Type Description
seconds number
The time in seconds to start recording at.

Starts the recording at the given time.

Returns:
void
stop()
Stop the recording.

Returns:
Promise<void>
Methods
Audio.createAudioPlayer(source, updateInterval)
Parameter Type
source
(optional)
AudioSource
updateInterval
(optional)
number

Creates an instance of an AudioPlayer that doesn't release automatically.

For most use cases you should use the useAudioPlayer hook instead. See the Using the AudioPlayer directly section for more details.
Returns:
AudioPlayer
Audio.getRecordingPermissionsAsync()
Returns:
Promise<PermissionResponse>
Audio.requestRecordingPermissionsAsync()
Returns:
Promise<PermissionResponse>
Audio.setAudioModeAsync(mode)
Parameter Type
mode Partial<AudioMode>

Returns:
Promise<void>
Audio.setIsAudioActiveAsync(active)
Parameter Type
active boolean

Returns:
Promise<void>
Event Subscriptions
Audio.useAudioSampleListener(player, listener)
Parameter Type
player AudioPlayer
listener (data: AudioSample) => void

Returns:
void
Types
AndroidAudioEncoder
Literal Type: string

Acceptable values are: 'default' | 'amr_nb' | 'amr_wb' | 'aac' | 'he_aac' | 'aac_eld'

AndroidOutputFormat
Literal Type: string

Acceptable values are: 'default' | '3gp' | 'mpeg4' | 'amrnb' | 'amrwb' | 'aac_adts' | 'mpeg2ts' | 'webm'

AudioEvents
Property Type Description
audioSampleUpdate (data: AudioSample) => void

-   playbackStatusUpdate (status: AudioStatus) => void
-   AudioMode
    Property Type Description
    allowsRecording
    (optional)
    boolean
    Only for:

Whether the audio session allows recording.

Default:
false
interruptionMode InterruptionMode
Only for:

Determines how the audio session interacts with other sessions.

interruptionModeAndroid InterruptionModeAndroid
Only for:

Determines how the audio session interacts with other sessions on Android.

playsInSilentMode boolean
Only for:

Determines if audio playback is allowed when the device is in silent mode.

shouldPlayInBackground
(optional)
boolean
Whether the audio session stays active when the app moves to the background.

Default:
false
shouldRouteThroughEarpiece boolean
Only for:

Whether the audio should route through the earpiece.

AudioSample
Property Type Description
channels AudioSampleChannel[]

-   timestamp number
-   AudioSampleChannel
    Property Type Description
    frames number[]
-   AudioSource
    Type: string or number or null or object shaped as below:

Property Type Description
assetId
(optional)
number
The asset ID of a local audio asset, acquired with the require function. This property is exclusive with the uri property. When both are present, the assetId will be ignored.

headers
(optional)
Record<string, string>
An object representing the HTTP headers to send along with the request for a remote audio source. On web requires the Access-Control-Allow-Origin header returned by the server to include the current domain.

uri
(optional)
string
A string representing the resource identifier for the audio, which could be an HTTPS address, a local file path, or the name of a static audio file resource.

AudioStatus
Property Type Description
currentTime number

-   didJustFinish boolean
-   duration number
-   id number
-   isBuffering boolean
-   isLoaded boolean
-   loop boolean
-   mute boolean
-   playbackRate number
-   playbackState string
-   playing boolean
-   reasonForWaitingToPlay string
-   shouldCorrectPitch boolean
-   timeControlStatus string
-   BitRateStrategy
    Literal Type: string

Acceptable values are: 'constant' | 'longTermAverage' | 'variableConstrained' | 'variable'

InterruptionMode
Literal Type: string

Acceptable values are: 'mixWithOthers' | 'doNotMix' | 'duckOthers'

InterruptionModeAndroid
Literal Type: string

Acceptable values are: 'doNotMix' | 'duckOthers'

PermissionExpiration
Literal Type: union

Permission expiration time. Currently, all permissions are granted permanently.

Acceptable values are: 'never' | number

PermissionResponse
An object obtained by permissions get and request functions.

Property Type Description
canAskAgain boolean
Indicates if user can be asked again for specific permission. If not, one should be directed to the Settings app in order to enable/disable the permission.

expires PermissionExpiration
Determines time when the permission expires.

granted boolean
A convenience boolean that indicates if the permission is granted.

status PermissionStatus
Determines the status of the permission.

PitchCorrectionQuality
Literal Type: string

Acceptable values are: 'low' | 'medium' | 'high'

RecorderState
Property Type Description
canRecord boolean

-   durationMillis number
-   isRecording boolean
-   mediaServicesDidReset boolean
-   metering
    (optional)
    number
-   url string | null
-   RecordingEvents
    Property Type Description
    recordingStatusUpdate (status: RecordingStatus) => void
-   RecordingInput
    Property Type Description
    name string
-   type string
-   uid string
-   RecordingOptions
    Property Type Description
    android RecordingOptionsAndroid
    Only for:

Recording options for the Android platform.

bitRate number
The desired bit rate.

Example

128000

extension string
The desired file extension.

Example

.caf

ios RecordingOptionsIos
Only for:

Recording options for the iOS platform.

isMeteringEnabled
(optional)
boolean
A boolean that determines whether audio level information will be part of the status object under the "metering" key.

numberOfChannels number
The desired number of channels.

Example

2

sampleRate number
The desired sample rate.

Example

44100

web
(optional)
RecordingOptionsWeb
Only for:

Recording options for the Web platform.

RecordingOptionsAndroid
Property Type Description
audioEncoder AndroidAudioEncoder
The desired audio encoder. See the AndroidAudioEncoder enum for all valid values.

extension
(optional)
string
The desired file extension.

Example

.caf

maxFileSize
(optional)
number
The desired maximum file size in bytes, after which the recording will stop (but stopAndUnloadAsync() must still be called after this point).

Example

65536

outputFormat AndroidOutputFormat
The desired file format. See the AndroidOutputFormat enum for all valid values.

sampleRate
(optional)
number
The desired sample rate.

Example

44100

RecordingOptionsIos
Property Type Description
audioQuality AudioQuality | number
The desired audio quality. See the AudioQuality enum for all valid values.

bitDepthHint
(optional)
number
The desired bit depth hint.

Example

16

bitRateStrategy
(optional)
number
The desired bit rate strategy. See the next section for an enumeration of all valid values of bitRateStrategy.

extension
(optional)
string
The desired file extension.

Example

.caf

linearPCMBitDepth
(optional)
number
The desired PCM bit depth.

Example

16

linearPCMIsBigEndian
(optional)
boolean
A boolean describing if the PCM data should be formatted in big endian.

linearPCMIsFloat
(optional)
boolean
A boolean describing if the PCM data should be encoded in floating point or integral values.

outputFormat
(optional)
string | IOSOutputFormat | number
The desired file format. See the IOSOutputFormat enum for all valid values.

sampleRate
(optional)
number
The desired sample rate.

Example

44100

RecordingOptionsWeb
Property Type Description
bitsPerSecond
(optional)
number

-   mimeType
    (optional)
    string
-   RecordingStatus
    Property Type Description
    error string | null
-   hasError boolean
-   id number
-   isFinished boolean
-   url string | null
-   Enums
    AudioQuality
    MIN
    AudioQuality.MIN ＝ 0
    LOW
    AudioQuality.LOW ＝ 32
    MEDIUM
    AudioQuality.MEDIUM ＝ 64
    HIGH
    AudioQuality.HIGH ＝ 96
    MAX
    AudioQuality.MAX ＝ 127
    IOSOutputFormat
    MPEGLAYER1
    IOSOutputFormat.MPEGLAYER1 ＝ ".mp1"
    MPEGLAYER2
    IOSOutputFormat.MPEGLAYER2 ＝ ".mp2"
    MPEGLAYER3
    IOSOutputFormat.MPEGLAYER3 ＝ ".mp3"
    MPEG4AAC
    IOSOutputFormat.MPEG4AAC ＝ "aac "
    MPEG4AAC_ELD
    IOSOutputFormat.MPEG4AAC_ELD ＝ "aace"
    MPEG4AAC_ELD_SBR
    IOSOutputFormat.MPEG4AAC_ELD_SBR ＝ "aacf"
    MPEG4AAC_ELD_V2
    IOSOutputFormat.MPEG4AAC_ELD_V2 ＝ "aacg"
    MPEG4AAC_HE
    IOSOutputFormat.MPEG4AAC_HE ＝ "aach"
    MPEG4AAC_LD
    IOSOutputFormat.MPEG4AAC_LD ＝ "aacl"
    MPEG4AAC_HE_V2
    IOSOutputFormat.MPEG4AAC_HE_V2 ＝ "aacp"
    MPEG4AAC_SPATIAL
    IOSOutputFormat.MPEG4AAC_SPATIAL ＝ "aacs"
    AC3
    IOSOutputFormat.AC3 ＝ "ac-3"
    AES3
    IOSOutputFormat.AES3 ＝ "aes3"
    APPLELOSSLESS
    IOSOutputFormat.APPLELOSSLESS ＝ "alac"
    ALAW
    IOSOutputFormat.ALAW ＝ "alaw"
    AUDIBLE
    IOSOutputFormat.AUDIBLE ＝ "AUDB"
    60958AC3
    IOSOutputFormat.60958AC3 ＝ "cac3"
    MPEG4CELP
    IOSOutputFormat.MPEG4CELP ＝ "celp"
    ENHANCEDAC3
    IOSOutputFormat.ENHANCEDAC3 ＝ "ec-3"
    MPEG4HVXC
    IOSOutputFormat.MPEG4HVXC ＝ "hvxc"
    ILBC
    IOSOutputFormat.ILBC ＝ "ilbc"
    APPLEIMA4
    IOSOutputFormat.APPLEIMA4 ＝ "ima4"
    LINEARPCM
    IOSOutputFormat.LINEARPCM ＝ "lpcm"
    MACE3
    IOSOutputFormat.MACE3 ＝ "MAC3"
    MACE6
    IOSOutputFormat.MACE6 ＝ "MAC6"
    AMR
    IOSOutputFormat.AMR ＝ "samr"
    AMR_WB
    IOSOutputFormat.AMR_WB ＝ "sawb"
    DVIINTELIMA
    IOSOutputFormat.DVIINTELIMA ＝ 1836253201
    MICROSOFTGSM
    IOSOutputFormat.MICROSOFTGSM ＝ 1836253233
    QUALCOMM
    IOSOutputFormat.QUALCOMM ＝ "Qclp"
    QDESIGN2
    IOSOutputFormat.QDESIGN2 ＝ "QDM2"
    QDESIGN
    IOSOutputFormat.QDESIGN ＝ "QDMC"
    MPEG4TWINVQ
    IOSOutputFormat.MPEG4TWINVQ ＝ "twvq"
    ULAW
    IOSOutputFormat.ULAW ＝ "ulaw"
    PermissionStatus
    DENIED
    PermissionStatus.DENIED ＝ "denied"
    User has denied the permission.

GRANTED
PermissionStatus.GRANTED ＝ "granted"
User has granted the permission.

UNDETERMINED
PermissionStatus.UNDETERMINED ＝ "undetermined"
User hasn't granted or denied the permission yet.

Previous (Expo SDK)

Asset
