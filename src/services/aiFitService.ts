import { Tutor } from './tutorService';
import { streamText } from 'ai';
import { openRouter } from 'ai/providers/openrouter';
import { config } from '@/config';

/**
 * Generate a fit summary using AI streaming
 * @param userNeed - The user's stated learning need or goal.
 * @param tutor - The tutor object containing bio, subject, etc.
 * @returns A readable stream of the AI response
 */
export const getFitSummary = async (userNeed: string, tutor: Tutor) => {
  console.log('aiFitService.getFitSummary called with:', { userNeed, tutor });
  
  const response = await streamText({
    model: openRouter('anthropic/claude-3-5-sonnet-20241022'),
    prompt: `You are a helpful tutor matching assistant. 
    User need: ${userNeed}
    Tutor profile: ${JSON.stringify(tutor)}
    
    Provide a concise, friendly summary of how this tutor matches the user's needs.
    Keep it under 200 words and use a conversational tone.`,
    maxTokens: 200,
  });
  
  return response.textStream;
};