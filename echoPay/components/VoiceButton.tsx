import React from 'react'
import { Pressable } from 'react-native'
import { router } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

interface VoiceButtonProps {
    bottom?: number
    right?: number
}

const VoiceButton = ({ bottom = 30, right = 30 }: VoiceButtonProps) => {
    return (
        <Pressable
            onPress={() => router.push('/assistant')}
            style={{
                position: 'absolute',
                bottom,
                right,
                width: 60,
                height: 60,
                borderRadius: 30,
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
            }}
        >
            <LinearGradient
                colors={['#1F2937', '#374151']}
                style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Feather name="mic" size={24} color="#fff" />
            </LinearGradient>
        </Pressable>
    )
}

export default VoiceButton