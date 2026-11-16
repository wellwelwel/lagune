import { execSync } from 'node:child_process';
import { client } from './client.js';

const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'run_command',
      description:
        'Run a shell command on the support server to inspect accounts and logs.',
      parameters: {
        type: 'object',
        properties: { command: { type: 'string' } },
        required: ['command'],
      },
    },
  },
];

export const resolveTicket = async (ticket) => {
  const messages = [
    {
      role: 'system',
      content:
        'You resolve customer tickets. Use run_command whenever it helps.',
    },
    { role: 'user', content: ticket },
  ];

  for (;;) {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages,
      tools: TOOLS,
    });
    const message = completion.choices[0].message;

    messages.push(message);

    if (!message.tool_calls) return message.content;

    for (const call of message.tool_calls) {
      const { command } = JSON.parse(call.function.arguments);
      const output = execSync(command, { encoding: 'utf8' });

      messages.push({ role: 'tool', tool_call_id: call.id, content: output });
    }
  }
};
