import { ChatMessage, BillSelectionData, BillPaymentData, TransferSelectionData, TransferData, CardSecurityData } from "../types/core"

interface SmartLLMResponse {
    type: "info" | "action" | "ignore" | "bill_selection" | "bill_payment" | "transfer_selection" | "transfer_payment" | "transfer_success" | "card_security"
    response: string
    needsOTP?: boolean
    actionData?: any | BillSelectionData | BillPaymentData | TransferSelectionData | TransferData | CardSecurityData
}

class SmartLLMService {
    private static instance: SmartLLMService
    private apiKey: string

    static getInstance(): SmartLLMService {
        if (!SmartLLMService.instance) {
            SmartLLMService.instance = new SmartLLMService()
        }
        return SmartLLMService.instance
    }

    constructor() {
        this.apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_KEY || ""
    }

    async processUserQuery(
        history: ChatMessage[], // ⬅️ new
    ): Promise<SmartLLMResponse> {
        /* -------- Trim history if too long -------- */
        const MAX_TOKENS = 3500 // keep a little headroom
        const trimmed = this.trimHistory(history, MAX_TOKENS)

        try {
            const startTime = Date.now()

            // Build messages for Claude format
            const messages = []
            let systemPrompt = ""

            // Extract system message
            const systemMessage = trimmed.find((msg) => msg.role === "system")
            if (systemMessage) {
                systemPrompt = systemMessage.content
                console.log("🧠 SmartLLM System Prompt Length:", systemPrompt.length)
                console.log("🧠 SmartLLM System Prompt (first 300 chars):", systemPrompt.substring(0, 300) + "...")
                
                // Check if bills data is present in system prompt
                const hasBillsData = systemPrompt.includes('شركة الكهرباء السعودية') || systemPrompt.includes('"bills"')
                console.log("🧠 SmartLLM System Prompt contains bills data:", hasBillsData)
                
                if (hasBillsData) {
                    const billsSection = systemPrompt.match(/Bills:.*?\],/s)?.[0]
                    console.log("🧠 SmartLLM Bills section (first 200 chars):", billsSection?.substring(0, 200) + "...")
                }
            }

            // Add conversation history
            const conversationHistory = trimmed.filter(
                (msg) => msg.role !== "system",
            )
            
            console.log("🧠 SmartLLM Conversation History:")
            for (const msg of conversationHistory) {
                console.log(`  ${msg.role}: "${msg.content}"`)
                messages.push({
                    role: msg.role === "user" ? "user" : "assistant",
                    content: msg.content,
                })
            }
            
            console.log("🧠 SmartLLM Total Messages:", messages.length)
            console.log("🧠 SmartLLM Latest User Message:", messages[messages.length - 1]?.content || "NONE")

            const response = await fetch(
                "https://api.anthropic.com/v1/messages",
                {
                    method: "POST",
                    headers: {
                        "x-api-key": this.apiKey,
                        "Content-Type": "application/json",
                        "anthropic-version": "2023-06-01",
                    },
                    body: JSON.stringify({
                        model: "claude-3-5-sonnet-20241022",
                        max_tokens: 1024,
                        system: systemPrompt,
                        messages: messages,
                    }),
                },
            )

            if (!response.ok) {
                const errorText = await response.text()
                console.error(
                    `❌ Claude API error ${response.status}:`,
                    errorText,
                )
                throw new Error(`Claude API error: ${response.status}`)
            }

            const data = await response.json()
            // Response received

            // Claude response structure - extract from content array
            let llmOutput = null

            // Claude returns content in the format: { content: [{ text: "..." }] }
            if (data.content && Array.isArray(data.content) && data.content[0]?.text) {
                llmOutput = data.content[0].text
                console.log("✅ Found content in Claude response")
                console.log("🧠 Claude Raw Response:", llmOutput)
            }

            if (!llmOutput) {
                console.error(
                    "❌ No content found in Claude response. Available keys:",
                    Object.keys(data),
                )
                throw new Error("No response content from Claude")
            }

            // Parse response

            // Parse JSON response from LLM with robust validation
            let parsedResponse: SmartLLMResponse
            try {
                // Check if response looks like JSON
                if (!llmOutput.trim().startsWith("{")) {
                    console.warn(
                        "⚠️ Claude returned non-JSON response, attempting to wrap...",
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
                    throw new Error("Missing required fields in Claude response")
                }
                
                console.log("🧠 Claude Parsed Response Type:", parsedResponse.type)
                console.log("🧠 Claude Parsed Response Text:", parsedResponse.response)
            } catch (parseError) {
                console.error("❌ Failed to parse Claude response:", parseError)
                console.error("❌ Raw response:", llmOutput)
                console.error("❌ Error details:", parseError)

                // Create emergency fallback response
                parsedResponse = {
                    type: "info",
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
            console.log(`⚡ SmartLLM (Claude) took ${duration}ms`)

            return parsedResponse
        } catch (error) {
            console.error("❌ SmartLLM (Claude) Service error:", error)
            return {
                type: "ignore",
                response: "عذراً، حدث خطأ في معالجة طلبك",
            }
        }
    }

    static isConfigured(): boolean {
        const instance = SmartLLMService.getInstance()
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

export default SmartLLMService.getInstance()
