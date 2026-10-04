import type { Agent } from '@site/src/data/registry';
import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import { ALL_AGENTS, deprecationNote } from '@site/src/data/registry';

const Status = ({ agent }: { agent: Agent }): ReactNode => {
  if (agent.deprecation === undefined) return null;

  const note = deprecationNote(agent.deprecation);

  return (
    <>
      {note.lead}
      {note.code !== undefined && (
        <>
          {' '}
          (<code>{note.code}</code>)
        </>
      )}
    </>
  );
};

export const SupportedAgents = (): ReactNode => (
  <table>
    <thead>
      <tr>
        <th>Agent</th>
        <th>Key (Alias)</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {ALL_AGENTS.map((agent) => (
        <tr key={agent.key}>
          <td>
            <Link to={agent.url}>{agent.name}</Link>
          </td>
          <td>
            <code>{agent.key}</code>
          </td>
          <td>
            <Status agent={agent} />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
