import { client } from './client.js';

export const summarize = async (ticket) => {
  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 200,
    messages: [
      {
        role: 'system',
        content: 'Summarize the customer ticket in two sentences.',
      },
      { role: 'user', content: ticket },
    ],
  });

  return completion.choices[0].message.content;
};
