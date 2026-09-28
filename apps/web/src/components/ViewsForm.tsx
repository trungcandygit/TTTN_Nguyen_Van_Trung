import { useState } from 'react';
import type { View } from '../api';

interface Props {
  tickers: string[];
  views: View[];
  onChange: (views: View[]) => void;
}

export function ViewsForm({ tickers, views, onChange }: Props) {
  const [asset, setAsset] = useState(tickers[0]);
  const [expectedReturn, setExpectedReturn] = useState(0.15);
  const [confidence, setConfidence] = useState(0.8);

  const addView = () => {
    onChange([...views, { assets: [asset], weights: [1], expected_return: expectedReturn, confidence }]);
  };

  const removeView = (i: number) => {
    onChange(views.filter((_, idx) => idx !== i));
  };

  return (
    <div>
      <div className="bl-form-row">
        <select value={asset} onChange={(e) => setAsset(e.target.value)}>
          {tickers.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input
          type="number"
          step="0.01"
          value={expectedReturn}
          onChange={(e) => setExpectedReturn(Number(e.target.value))}
          placeholder="Lợi suất kỳ vọng (vd 0.15)"
        />
        <input
          type="number"
          step="0.05"
          min={0.01}
          max={1}
          value={confidence}
          onChange={(e) => setConfidence(Number(e.target.value))}
          placeholder="Độ tin cậy (0-1)"
        />
        <button className="bl-btn secondary" onClick={addView}>
          + Thêm quan điểm
        </button>
      </div>

      {views.length > 0 && (
        <table className="bl-table" style={{ marginTop: 10 }}>
          <thead>
            <tr>
              <th>Mã</th>
              <th>Lợi suất kỳ vọng</th>
              <th>Độ tin cậy</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {views.map((v, i) => (
              <tr key={i}>
                <td>{v.assets.join(', ')}</td>
                <td>{(v.expected_return * 100).toFixed(1)}%</td>
                <td>{(v.confidence * 100).toFixed(0)}%</td>
                <td>
                  <button className="bl-btn danger" onClick={() => removeView(i)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
