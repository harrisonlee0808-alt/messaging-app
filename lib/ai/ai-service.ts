import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
})

export interface AIPromptOptions {
  maxTokens?: number
  temperature?: number
  model?: string
}

export class AIService {
  private defaultModel = "gpt-4o-mini"
  private defaultMaxTokens = 1000
  private defaultTemperature = 0.7

  async generateText(
    prompt: string,
    options: AIPromptOptions = {}
  ): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: options.model || this.defaultModel,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: options.maxTokens || this.defaultMaxTokens,
        temperature: options.temperature || this.defaultTemperature,
      })

      return response.choices[0]?.message?.content || ""
    } catch (error) {
      console.error("Error generating AI text:", error)
      throw error
    }
  }

  async summarizeConversation(messages: Array<{ content: string; user: string }>): Promise<string> {
    const conversationText = messages
      .map((m) => `${m.user}: ${m.content}`)
      .join("\n")

    const prompt = `Summarize the following conversation in a concise way, highlighting key points, decisions made, and action items:\n\n${conversationText}\n\nSummary:`

    return this.generateText(prompt, {
      maxTokens: 500,
      temperature: 0.5,
    })
  }

  async generateCommitMessage(fileChanges: Array<{ path: string; content: string }>): Promise<string> {
    const changesSummary = fileChanges
      .map((change) => {
        const lines = change.content.split("\n").length
        return `${change.path} (${lines} lines changed)`
      })
      .join("\n")

    const prompt = `Generate a concise, conventional commit message for these file changes. Use conventional commit format (feat:, fix:, refactor:, etc.):\n\n${changesSummary}\n\nCommit message:`

    return this.generateText(prompt, {
      maxTokens: 100,
      temperature: 0.3,
    })
  }

  async explainCode(code: string, language?: string): Promise<string> {
    const prompt = `Explain what this ${language || "code"} does in simple terms:\n\n\`\`\`${language || ""}\n${code}\n\`\`\`\n\nExplanation:`

    return this.generateText(prompt, {
      maxTokens: 500,
      temperature: 0.5,
    })
  }

  async suggestCodeImprovements(
    code: string,
    language?: string
  ): Promise<string> {
    const prompt = `Review this ${language || "code"} and suggest improvements for readability, performance, or best practices:\n\n\`\`\`${language || ""}\n${code}\n\`\`\`\n\nSuggestions:`

    return this.generateText(prompt, {
      maxTokens: 800,
      temperature: 0.6,
    })
  }

  async answerCodeQuestion(
    question: string,
    contextCode?: string
  ): Promise<string> {
    const prompt = contextCode
      ? `Based on this code context, answer the question:\n\nCode:\n\`\`\`\n${contextCode}\n\`\`\`\n\nQuestion: ${question}\n\nAnswer:`
      : `Answer this coding question: ${question}\n\nAnswer:`

    return this.generateText(prompt, {
      maxTokens: 1000,
      temperature: 0.7,
    })
  }

  async extractTasks(conversation: Array<{ content: string; user: string }>): Promise<string[]> {
    const conversationText = conversation
      .map((m) => `${m.user}: ${m.content}`)
      .join("\n")

    const prompt = `Extract actionable tasks and TODO items from this conversation. Return them as a JSON array of strings:\n\n${conversationText}\n\nTasks (JSON array):`

    try {
      const response = await this.generateText(prompt, {
        maxTokens: 500,
        temperature: 0.4,
      })

      // Try to parse JSON array from response
      const jsonMatch = response.match(/\[.*\]/s)
      if (jsonMatch) {
        const tasks = JSON.parse(jsonMatch[0])
        return Array.isArray(tasks) ? tasks : []
      }

      // Fallback: split by newlines and filter
      return response
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0 && (line.startsWith("-") || line.match(/^\d+\./)))
        .map((line) => line.replace(/^[-•]\s*|\d+\.\s*/, ""))
    } catch (error) {
      console.error("Error extracting tasks:", error)
      return []
    }
  }
}

export const aiService = new AIService()

