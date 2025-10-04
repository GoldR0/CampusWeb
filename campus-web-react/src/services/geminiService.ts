import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || 'AIzaSyDYSXShZ89-LkTcJ_x7txJNWfSKkb7fnQo';

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatbotResponse {
  success: boolean;
  message: string;
  isRelevant: boolean;
}

export class GeminiService {
  private static instance: GeminiService;
  private conversationHistory: ChatMessage[] = [];

  private constructor() {}

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  public async sendMessage(userMessage: string): Promise<ChatbotResponse> {
    try {
      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      });

      // Create system prompt with context about the website
      const systemPrompt = `
אתה עוזר וירטואלי למערכת קמפוס - מערכת ניהול מקיפה לסטודנטים ומרצים במכללה.

תפקידך:
1. לעזור למשתמשים להשתמש באתר קמפוס
2. לענות על שאלות הקשורות ללימודים במכללה
3. להסביר על תכונות האתר: ניהול מטלות, ציונים, קפיטריה, מציאות ואבדות, שוק יד שנייה, פורום, שירותים

חשוב:
- ענה רק על שאלות הקשורות לאתר קמפוס או ללימודים במכללה
- אם השאלה לא קשורה, ענה: "סליחה, אני יכול לעזור רק עם שאלות הקשורות לאתר קמפוס וללימודים במכללה. איך אוכל לעזור לך עם השימוש באתר?"
- ענה בעברית בלבד
- השתמש בטון ידידותי ומקצועי
- אם אינך בטוח, בקש הבהרה

השאלה של המשתמש: ${userMessage}
`;

      const result = await model.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text();

      // Check if the response is relevant (not the standard "not related" message)
      const isRelevant = !text.includes('סליחה, אני יכול לעזור רק עם שאלות הקשורות');

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: text,
        timestamp: new Date()
      });

      return {
        success: true,
        message: text,
        isRelevant
      };

    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return {
        success: false,
        message: 'סליחה, אירעה שגיאה טכנית. אנא נסה שוב מאוחר יותר.',
        isRelevant: false
      };
    }
  }

  public getConversationHistory(): ChatMessage[] {
    return [...this.conversationHistory];
  }

  public clearHistory(): void {
    this.conversationHistory = [];
  }
}

export default GeminiService;
