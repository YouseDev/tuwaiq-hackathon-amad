interface FastLLMResponse {
    fillerAudio: string
    waitingMessage: string
}

// Pre-written Arabic filler messages for different request types
const FILLER_MESSAGES = {
    balance_check: ["أتحقق من رصيدك", "لحظة، أراجع حسابك", "أستعلم عن رصيدك"],
    transaction_search: [
        "أبحث في معاملاتك",
        "أراجع تاريخ حسابك",
        "أفتش في المعاملات",
    ],
    transfer_payment: [
        "أجهز التحويل",
        "أعالج المدفوعات",
        "أحضر تفاصيل الفواتير",
    ],
    general_request: ["لحظة من فضلك", "أعمل على طلبك", "لحظة، أساعدك"],
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

            // Use FastLLM only for categorization, not Arabic generation
            const prompt = `Categorize this Saudi banking voice command into one category:

USER COMMAND: "${userCommand}"

CATEGORIES:
- balance_check: ONLY balance inquiries, account totals, "كم رصيدي", "مجموع حسابي"
- transaction_search: Transaction history, bills inquiry, spending queries, "وش صرفت", "فواتير", "ايش عندي فواتير"  
- transfer_payment: Transfers, bill payments, "حول فلوس", "ادفع", "سدد"
- general_request: Greetings, general help, unclear requests

CRITICAL: "فواتير" (bills) = transaction_search, NOT balance_check

Respond with ONLY the category name (no JSON, no explanation):`

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
                        max_tokens: 10,
                        temperature: 0.1,
                    }),
                },
            )

            let category = "general_request" // default fallback

            if (response.ok) {
                const data = await response.json()
                const content = data.choices?.[0]?.message?.content?.trim()

                // Validate category
                if (
                    content &&
                    FILLER_MESSAGES[content as keyof typeof FILLER_MESSAGES]
                ) {
                    category = content
                    console.log(`✅ FastLLM categorized as: ${category}`)
                }
            }

            // Select random message from pre-written Arabic messages
            const messages =
                FILLER_MESSAGES[category as keyof typeof FILLER_MESSAGES]
            const randomMessage =
                messages[Math.floor(Math.random() * messages.length)]

            const endTime = Date.now()
            const duration = endTime - startTime
            console.log(`⚡ FastLLM took ${duration}ms`)

            return {
                fillerAudio: category,
                waitingMessage: randomMessage,
            }
        } catch (error) {
            console.error("❌ FastLLM Service error:", error)
            // Return safe fallback with random general message
            const generalMessages = FILLER_MESSAGES.general_request
            const randomMessage =
                generalMessages[
                    Math.floor(Math.random() * generalMessages.length)
                ]

            return {
                fillerAudio: "general_request",
                waitingMessage: randomMessage,
            }
        }
    }

    static isConfigured(): boolean {
        const instance = FastLLMService.getInstance()
        return !!instance.apiKey
    }
}

export default FastLLMService.getInstance()
