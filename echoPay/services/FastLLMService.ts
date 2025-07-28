interface FastLLMResponse {
    fillerAudio: string
    waitingMessage: string
}

class FastLLMService {
    private static instance: FastLLMService
    private apiKey: string

    static getInstance(): FastLLMService {
        if (!FastLLMService.instance) {
            FastLLMService.instance = new FastLLMService()
        }
        return FastLLMService.instance
    }

    constructor() {
        this.apiKey = process.env.EXPO_PUBLIC_OPENAI_KEY || ""
    }

    async selectFillerAudio(userCommand: string): Promise<FastLLMResponse> {
        try {
            const startTime = Date.now()

            const prompt = `You are a fast assistant for a Saudi banking voice app. Analyze user command and provide appropriate filler audio + contextual waiting message.

USER COMMAND: "${userCommand}"

AVAILABLE FILLER AUDIO:
- "balance_check": For balance inquiries and account status
- "transaction_search": For searching transactions and financial history  
- "general_request": For general processing and queries
- "transfer_payment": For transfers and bill payments

RESPONSE RULES:
1. Select appropriate fillerAudio key
2. Create contextual waitingMessage in Saudi Arabic (casual, professional)
3. Make waiting message specific to the request type
4. Keep message short (≤ 3 words)

EXAMPLES:
{"fillerAudio": "balance_check", "waitingMessage": "أتحقق من رصيدك"}
{"fillerAudio": "transaction_search", "waitingMessage": "أبحث في معاملاتك"}
{"fillerAudio": "transfer_payment", "waitingMessage": "أجهز التحويل"}
{"fillerAudio": "general_request", "waitingMessage": "لحظة من فضلك"}

Respond with JSON only:`

            const response = await fetch(
                "https://api.openai.com/v1/chat/completions",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: "gpt-4.1-nano-2025-04-14",
                        messages: [
                            {
                                role: "user",
                                content: prompt,
                            },
                        ],
                        max_tokens: 50,
                        temperature: 0.1,
                    }),
                },
            )

            if (!response.ok) {
                const errorText = await response.text()
                console.error(
                    `❌ FastLLM API error ${response.status}:`,
                    errorText,
                )
                throw new Error(`FastLLM API error: ${response.status}`)
            }

            const data = await response.json()
            const content = data.choices?.[0]?.message?.content

            if (!content) {
                throw new Error("No response content from FastLLM")
            }

            // Parse JSON response
            let parsedResponse: FastLLMResponse
            try {
                // Extract JSON if embedded in text
                const jsonMatch = content.match(/\{[^}]*\}/)
                if (jsonMatch) {
                    parsedResponse = JSON.parse(jsonMatch[0])
                } else {
                    parsedResponse = JSON.parse(content)
                }

                // Validate response
                if (!parsedResponse.fillerAudio || !parsedResponse.waitingMessage) {
                    throw new Error("Missing required fields in FastLLM response")
                }
            } catch (parseError) {
                console.error(
                    "❌ Failed to parse FastLLM response:",
                    parseError,
                )
                console.error("❌ Raw response:", content)

                // Fallback to general_request
                parsedResponse = {
                    fillerAudio: "general_request",
                    waitingMessage: "لحظة من فضلك"
                }
            }

            const endTime = Date.now()
            const duration = endTime - startTime
            console.log(`⚡ FastLLM took ${duration}ms`)

            return parsedResponse
        } catch (error) {
            console.error("❌ FastLLM Service error:", error)
            // Return safe fallback
            return {
                fillerAudio: "general_request",
                waitingMessage: "لحظة من فضلك"
            }
        }
    }

    static isConfigured(): boolean {
        const instance = FastLLMService.getInstance()
        return !!instance.apiKey
    }
}

export default FastLLMService.getInstance()
