interface Props {
  tickers: string[];
  marketCaps: Record<string, number>;
  onMarketCapsChange: (caps: Record<string, number>) => void;
  riskFreeRate: number;
  onRiskFreeRateChange: (v: number) => void;
  tau: number;
  onTauChange: (v: number) => void;
  dataSource: 'demo' | 'upload';
  onDataSourceChange: (v: 'demo' | 'upload') => void;
  uploadFile: File | null;
  onUploadFileChange: (f: File | null) => void;
}

export function ParamsPanel({
  tickers,
  marketCaps,
  onMarketCapsChange,
  riskFreeRate,
  onRiskFreeRateChange,
  tau,
  onTauChange,
  dataSource,
  onDataSourceChange,
  uploadFile,
  onUploadFileChange
}: Props) {
  return (
    <div>
      <div className="bl-form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
        <label className="bl-field-label">
          Lãi suất phi rủi ro
          <input
            type="number"
            step="0.005"
            value={riskFreeRate}
            onChange={(e) => onRiskFreeRateChange(Number(e.target.value))}
          />
        </label>
        <label className="bl-field-label">
          Hệ số điều chỉnh tau
          <input type="number" step="0.01" value={tau} onChange={(e) => onTauChange(Number(e.target.value))} />
        </label>
        <label className="bl-field-label">
          Nguồn dữ liệu giá
          <select value={dataSource} onChange={(e) => onDataSourceChange(e.target.value as 'demo' | 'upload')}>
            <option value="demo">Dữ liệu demo (synthetic)</option>
            <option value="upload">Tải file CSV giá thật</option>
          </select>
        </label>
        {dataSource === 'upload' && (
          <label className="bl-field-label">
            File CSV (cột Date + mã CP)
            <input
              type="file"
              accept=".csv"
              onChange={(e) => onUploadFileChange(e.target.files?.[0] ?? null)}
            />
          </label>
        )}
      </div>

      <table className="bl-table" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>Mã</th>
            <th>Vốn hóa thị trường (giả định, tỷ đồng)</th>
          </tr>
        </thead>
        <tbody>
          {tickers.map((t) => (
            <tr key={t}>
              <td>
                <span className="bl-pill">{t}</span>
              </td>
              <td>
                <input
                  type="number"
                  step="1000"
                  value={marketCaps[t] ?? 0}
                  onChange={(e) => onMarketCapsChange({ ...marketCaps, [t]: Number(e.target.value) })}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
