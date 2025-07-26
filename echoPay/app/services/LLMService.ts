interface LLMResponse {
    type: "info" | "action" | "ignore"
    fillerAudio?: string
    response: string
    needsOTP?: boolean
    actionData?: any
}

interface BankingContext {
    user: any
    accounts: any
    creditCards: any[]
    transactions: any[]
    bills: any[]
    contacts: any[]
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
        userInput: string,
        bankingContext: BankingContext,
    ): Promise<LLMResponse> {
        if (!this.apiKey) {
            return {
                type: "ignore",
                response: "خدمة الذكاء الاصطناعي غير متاحة حالياً",
            }
        }

        // LLM will handle echo keyword verification
        const startTime = Date.now()

        try {
            const prompt = this.buildPrompt(userInput, bankingContext)
            console.log("🧠 Sending to OpenAI:", userInput)

            const response = await fetch(
                "https://api.openai.com/v1/chat/completions",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: "gpt-4.1",
                        messages: [
                            {
                                role: "system",
                                content: prompt,
                            },
                            {
                                role: "user",
                                content: userInput,
                            },
                        ],
                    }),
                },
            )

            const apiTime = Date.now() - startTime
            console.log(`⏱️ OpenAI API took: ${apiTime}ms`)

            if (!response.ok) {
                const errorText = await response.text()
                console.error(
                    `❌ OpenAI API error ${response.status}:`,
                    errorText,
                )
                throw new Error(`OpenAI API error: ${response.status}`)
            }

            const data = await response.json()
            console.log("🔍 Full API Response:", JSON.stringify(data, null, 2))

            const llmOutput = data.choices[0]?.message?.content

            if (!llmOutput) {
                console.error(
                    "❌ No content in response. Data structure:",
                    data,
                )
                throw new Error("No response from OpenAI")
            }

            console.log("🔍 Raw LLM Output:", llmOutput)

            // Parse JSON response from LLM
            let parsedResponse: LLMResponse
            try {
                parsedResponse = JSON.parse(llmOutput)
            } catch (parseError) {
                console.error(
                    "❌ Failed to parse LLM JSON response:",
                    parseError,
                )
                console.error(
                    "❌ Raw response that failed to parse:",
                    llmOutput,
                )
                throw new Error("Invalid JSON response from LLM")
            }

            const totalTime = Date.now() - startTime
            console.log(`✅ LLM Complete - Total time: ${totalTime}ms`)
            console.log("📋 LLM Response:", {
                type: parsedResponse.type,
                fillerAudio: parsedResponse.fillerAudio,
                response: parsedResponse.response,
                needsOTP: parsedResponse.needsOTP,
            })

            return parsedResponse
        } catch (error) {
            const totalTime = Date.now() - startTime
            console.error(`❌ LLM Service error after ${totalTime}ms:`, error)
            return {
                type: "ignore",
                response: "عذراً، حدث خطأ في معالجة طلبك",
            }
        }
    }

    private buildPrompt(userInput: string, context: BankingContext): string {
        return `You are "Echo", a smart Saudi banking assistant for a Bank. Respond in Saudi Arabic dialect, casual but professional.
      
      COMPLETE USER DATA:
      User Info: ${JSON.stringify(context.user, null, 2)}
      Accounts: ${JSON.stringify(context.accounts, null, 2)}
      Credit Cards: ${JSON.stringify(context.creditCards, null, 2)}
      Recent Transactions: ${JSON.stringify(context.transactions.slice(0, 10), null, 2)}
      Bills: ${JSON.stringify(context.bills, null, 2)}
      Contacts: ${JSON.stringify(context.contacts, null, 2)}
      
      RESPONSE RULES:
      1. For info queries (balance, transactions, cards) use "type":"info".
      2. For actions (transfers, bill payments) use "type":"action" and set "needsOTP":true.
      3. Keep answers SHORT and CONCISE (≤ 2 sentences).
      4. **Write all numbers fully in Arabic words, not digits**  
         • Example: "مئة ريال" ✅ — not "100 ريال" ❌
      5. Use the exact data provided; no assumptions. Mention names & amounts explicitly.
      6. Remain casual yet professional in the Saudi dialect.
      
      FILLER AUDIO KEYS:
      - "checking_balance"(balance queries)
      - "checking_transactions" (transaction history)
      - "processing_request"(general)
      - "preparing_transfer"(transfers / payments)
      
      RESPONSE EXAMPLES (WITH WORDS, NOT DIGITS):
      - Balance: "رصيدك الجاري خمسة آلاف ومئتان وستة وستون ريال، والتوفير اثنا عشر ألفًا وثمانمئة وخمسون ريال."
      - Spending: "صرفت مئتين وستين ريال على المطاعم هالشهر في خمس معاملات."
      - Bills: "عندك ثلاث فواتير مستحقة: الكهرباء مئتان وخمسة وثمانون ريال، المياه خمسة وتسعون ريال، زين مئة وخمسة وعشرون ريال."
      
      ALWAYS reply in this exact JSON schema:
      {
        "type": "info" | "action" | "ignore",
        "fillerAudio": "audio_key",
        "response": "short Arabic response",
        "needsOTP": false,
        "actionData": {}
      }`
    }

    static isConfigured(): boolean {
        const instance = LLMService.getInstance()
        return !!instance.apiKey
    }
}

export default LLMService.getInstance()
