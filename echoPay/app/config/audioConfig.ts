export const PRERECORDED_AUDIO = {
    welcome: {
        key: "welcome",
        arabicText: "أهلاً وسهلاً",
        audioFile: require("../../assets/audio/welcome.mp3"),
    },
} as const

export type PrerecordedAudioKey = keyof typeof PRERECORDED_AUDIO

export default PRERECORDED_AUDIO
