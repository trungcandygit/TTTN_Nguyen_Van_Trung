import type { BlackLittermanResponse } from '../api';

export interface Scenario {
  label: string;
  response: BlackLittermanResponse;
}

interface Props {
  scenarios: Scenario[];
}

const pct = (x: number) => `${(x * 100).toFixed(1)}%`;

export function ScenarioHistory({ scenarios }: Props) {
  if (scenarios.length === 0) {
    return <div className="bl-subtitle">Chưa có kịch bản nào được lưu trong phiên này.</div>;
  }

  const tickers = scenarios[0].response.tickers;

  return (
    <table className="bl-table">
      <thead>
        <tr>
          <th>Kịch bản</th>
          {tickers.map((t) => (
            <th key={t}>{t}</th>
          ))}
          <th>Delta</th>
        </tr>
      </thead>
      <tbody>
        {scenarios.map((s, i) => (
          <tr key={i}>
            <td>{s.label}</td>
            {s.response.weights_optimal.map((w, j) => (
              <td key={j}>{pct(w)}</td>
            ))}
            <td>{s.response.delta.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
