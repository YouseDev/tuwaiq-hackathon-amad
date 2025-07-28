import { ChatMessage } from "../types/core"

interface LLMResponse {
    type: "info" | "action" | "ignore"
    fillerAudio?: string
    response: string
    needsOTP?: boolean
    actionData?: any
}

class LLMService {
    private static instance: LLMService
    private apiKey: string

    static getInstance(): LLMService {
        if (!LLMService.instance) {
            LLMService.instance = new LLMService()
        }
        return LLMService.instance
    }

    constructor() {
        this.apiKey = process.env.EXPO_PUBLIC_OPENAI_KEY || ""
    }

    async processUserQuery(
        history: ChatMessage[], // ⬅️ new
    ): Promise<LLMResponse> {
        /* -------- Trim history if too long -------- */
        const MAX_TOKENS = 3500 // keep a little headroom
        const trimmed = this.trimHistory(history, MAX_TOKENS)

        try {
            const startTime = Date.now()

            // Build the input for o4-mini format
            const input = []

            // Add system prompt as developer role
            const systemMessage = trimmed.find((msg) => msg.role === "system")
            if (systemMessage) {
                input.push({
                    role: "developer",
                    content: [
                        {
                            type: "input_text",
                            text: systemMessage.content,
                        },
                    ],
                })
            }

            // Add conversation history as user inputs
            const conversationHistory = trimmed.filter(
                (msg) => msg.role !== "system",
            )
            if (conversationHistory.length > 0) {
                const historyText = conversationHistory
                    .map(
                        (msg) =>
                            `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`,
                    )
                    .join("\n\n")

                input.push({
                    role: "user",
                    content: [
                        {
                            type: "input_text",
                            text: historyText,
                        },
                    ],
                })
            }

            const response = await fetch(
                "https://api.openai.com/v1/responses",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: "o4-mini",
                        input: input,
                        text: {
                            format: {
                                type: "text",
                            },
                        },
                        reasoning: {
                            effort: "low",
                        },
                        tools: [],
                        store: true,
                    }),
                },
            )

            if (!response.ok) {
                const errorText = await response.text()
                console.error(
                    `❌ o4-mini API error ${response.status}:`,
                    errorText,
                )
                throw new Error(`o4-mini API error: ${response.status}`)
            }

            const data = await response.json()
            // Response received

            // o4-mini response structure - extract from nested output
            let llmOutput = null

            // Try to find the message output in the array
            if (data.output && Array.isArray(data.output)) {
                const messageOutput = data.output.find(
                    (item: any) => item.type === "message",
                )
                if (messageOutput?.content?.[0]?.text) {
                    llmOutput = messageOutput.content[0].text
                    console.log(
                        "✅ Found content in data.output[message].content[0].text",
                    )
                }
            }

            // Fallback attempts
            if (!llmOutput && data.text && typeof data.text === "string") {
                llmOutput = data.text
                console.log("✅ Found content in data.text (fallback)")
            } else if (!llmOutput && data.content) {
                llmOutput = data.content
                console.log("✅ Found content in data.content (fallback)")
            } else if (!llmOutput && data.choices?.[0]?.message?.content) {
                llmOutput = data.choices[0].message.content
                console.log(
                    "✅ Found content in data.choices[0].message.content (fallback)",
                )
            }

            if (!llmOutput) {
                console.error(
                    "❌ No content found in o4-mini response. Available keys:",
                    Object.keys(data),
                )
                throw new Error("No response content from o4-mini")
            }

            // Parse response

            // Parse JSON response from LLM with robust validation
            let parsedResponse: LLMResponse
            try {
                // Check if response looks like JSON
                if (!llmOutput.trim().startsWith("{")) {
                    console.warn(
                        "⚠️ LLM returned non-JSON response, attempting to wrap...",
                    )
                    // Try to extract JSON if it's embedded
                    const jsonMatch = llmOutput.match(/\{[\s\S]*\}/)
                    if (jsonMatch) {
                        parsedResponse = JSON.parse(jsonMatch[0])
                        console.log("✅ Extracted JSON from mixed response")
                    } else {
                        // Create fallback JSON response
                        console.warn("⚠️ Creating fallback JSON response")
                        parsedResponse = {
                            type: "info",
                            fillerAudio: "processing_request",
                            response: llmOutput.trim(),
                            needsOTP: false,
                            actionData: {},
                        }
                    }
                } else {
                    parsedResponse = JSON.parse(llmOutput)
                }

                // Validate required fields
                if (!parsedResponse.type || !parsedResponse.response) {
                    throw new Error("Missing required fields in LLM response")
                }
            } catch (parseError) {
                console.error("❌ Failed to parse LLM response:", parseError)
                console.error("❌ Raw response:", llmOutput)
                console.error("❌ Error details:", parseError)

                // Create emergency fallback response
                parsedResponse = {
                    type: "info",
                    fillerAudio: "processing_request",
                    response: llmOutput.includes("عندك")
                        ? llmOutput.trim()
                        : "عذراً، حدث خطأ في معالجة طلبك",
                    needsOTP: false,
                    actionData: {},
                }
                console.log("🛠️ Using emergency fallback response")
            }

            const endTime = Date.now()
            const duration = endTime - startTime
            console.log(`⚡ LLM took ${duration}ms`)

            return parsedResponse
        } catch (error) {
            console.error("❌ LLM Service error")
            return {
                type: "ignore",
                response: "عذراً، حدث خطأ في معالجة طلبك",
            }
        }
    }

    static isConfigured(): boolean {
        const instance = LLMService.getInstance()
        return !!instance.apiKey
    }

    /* --- helper: drop oldest msgs once token budget exceeded --- */
    private trimHistory(history: ChatMessage[], budget: number) {
        let tokens = 0
        const reversed: ChatMessage[] = []
        for (let i = history.length - 1; i >= 0; i--) {
            tokens += this.roughTokenCount(history[i].content)
            if (tokens > budget) break
            reversed.push(history[i])
        }
        return reversed.reverse()
    }

    private roughTokenCount(text: string) {
        return Math.ceil(text.length / 4) // quick heuristic
    }
}

export default LLMService.getInstance()
