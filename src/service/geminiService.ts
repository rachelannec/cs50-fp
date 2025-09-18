import { GoogleGenerativeAI } from "@google/generative-ai"; // npm install @google/generative-ai  

// get api kew from env
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY){
    console.warn("Warning: No API key found for Gemini API. Please set VITE_GEMINI_API_KEY in your environment variables.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

interface Flashcard {
    id: string;
    question: string;
    answer: string;
}

export async function generateFlashcards(text: string):      Promise<Flashcard[]>{
    if (!API_KEY){
        throw new Error("No API key found for Gemini API.");
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash'})

        const prompt = `Based on the following text, generate 8-12 flashcards for active recall learning. Return the flashcards as a JSON array, where each item is an object with a "question" and an "answer". The questions should be thought-provoking but not overly complex. Answers must be short, clear, and use simple language. Use identification (provide the definition as question and the terminology as answer), true/false, and multiple-choice questions where appropriate.


        Format your response as a valid JSON array with this exact structure:
        [
            {
                "question": "Your question here?",
                "answer": "Your answer here."
            }
        ]

        Text content: ${text.substring(0, 2000)}

        Respond with only the JSON array, no additional text or explanation.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const generatedText  = response.text();

        // clean markedown if any
        const cleanedText = generatedText.replace(/```json|```/g, '').trim();

        // parse json (eto na 'yon, baks)
        const flashcards = JSON.parse(cleanedText);

        // add unique ids to each flashcard
        return flashcards.map((card:any, index: number) =>({
            id: `fc-${Date.now()}-${index}`,
            question: card.question,
            answer: card.answer
        }))
    } catch(error){
        console.error("Error generating flashcards:", error);
        throw new Error('Failed to generate flashcards. Please try again.');
    }
}