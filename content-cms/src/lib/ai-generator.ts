import { GoogleGenerativeAI } from '@google/generative-ai';
import type { QuizInput, QuizCategory, QuizDifficulty } from '@japan-trivia/shared';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface GenerateQuizzesParams {
  category: QuizCategory;
  difficulty: QuizDifficulty;
  count: number;
}

export async function generateQuizzes({
  category,
  difficulty,
  count,
}: GenerateQuizzesParams): Promise<QuizInput[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `You are creating quiz questions about Japan for English-speaking tourists visiting Japan.

Generate ${count} UNIQUE and DIVERSE multiple-choice quiz questions with the following criteria:
- Category: ${category}
- Difficulty: ${difficulty}
- Language: English
- Format: 4 options per question
- Target audience: English-speaking tourists who will visit Japan

DIVERSITY REQUIREMENTS (CRITICAL):
- Cover different aspects within the ${category} category (history, modern usage, cultural significance, practical information, trivia)
- Vary the focus: some about origins, some about current practices, some about regional differences
- Include both well-known and lesser-known facts
- Ask questions from different angles (what, why, when, where, how)
- Avoid repetitive question patterns

CONTENT GUIDELINES:
- Avoid any content that could be considered racist, discriminatory, or culturally insensitive
- Focus on positive, educational, and interesting facts about Japan
- Ensure accuracy of information
- Make questions engaging and fun for tourists

EXPLANATION REQUIREMENTS:
- Each explanation must be 2-3 sentences long
- Include the main reason why the answer is correct
- Add an interesting additional fact or context
- Make it educational and memorable

Return ONLY a valid JSON array with this exact structure (no markdown, no explanation):
[
  {
    "question": "Question text here?",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctAnswer": 0,
    "explanation": "First sentence explaining why this is correct. Second sentence with interesting additional context or fact.",
    "difficulty": "${difficulty}",
    "category": "${category}",
    "tags": ["tag1", "tag2"]
  }
]

correctAnswer must be the index (0-3) of the correct option.
Explanation MUST be 2-3 complete sentences.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // JSONの抽出（マークダウンコードブロックを削除）
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    
    const quizzes = JSON.parse(jsonText);
    
    // バリデーション
    if (!Array.isArray(quizzes)) {
      throw new Error('Response is not an array');
    }
    
    return quizzes;
  } catch (error) {
    console.error('Failed to generate quizzes:', error);
    throw new Error('Failed to generate quizzes with AI');
  }
}