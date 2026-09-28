import type { BlackLittermanResponse } from '../api';

interface Props {
  result: BlackLittermanResponse;
}

const pct = (x: number) => `${(x * 100).toFixed(2)}%`;

export function HoldingsTable({ result }: Props) {
  return (
    <table className="bl-table">
      <thead>
        <tr>
          <th>Mã</th>
          <th>Trọng số thị trường</th>
          <th>Lợi suất cân bằng (pi)</th>
          <th>Lợi suất hậu nghiệm E[R]</th>
          <th>Trọng số tối ưu</th>
          <th>Chênh lệch</th>
        </tr>
      </thead>
      <tbody>
        {result.tickers.map((t, i) => {
          const diff = result.weights_optimal[i] - result.weights_market[i];
          return (
            <tr key={t}>
              <td>
                <span className="bl-pill">{t}</span>
              </td>
              <td>{pct(result.weights_market[i])}</td>
              <td>{pct(result.implied_equilibrium_returns[i])}</td>
              <td>{pct(result.posterior_returns[i])}</td>
              <td>{pct(result.weights_optimal[i])}</td>
              <td style={{ color: diff >= 0 ? 'var(--bl-accent)' : 'var(--bl-danger)' }}>
                {diff >= 0 ? '+' : ''}
                {pct(diff)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
