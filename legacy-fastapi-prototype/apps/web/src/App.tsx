import { useState } from 'react';
import './theme.css';
import { runDemo, runUpload, type BlackLittermanResponse, type View } from './api';
import { AllocationChart } from './components/AllocationChart';
import { HoldingsTable } from './components/HoldingsTable';
import { ViewsForm } from './components/ViewsForm';
import { ParamsPanel } from './components/ParamsPanel';
import { ScenarioHistory, type Scenario } from './components/ScenarioHistory';

const DEFAULT_TICKERS = ['VCB', 'BID', 'CTG', 'TCB', 'MBB'];
const DEFAULT_CAPS: Record<string, number> = {
  VCB: 500000,
  BID: 250000,
  CTG: 220000,
  TCB: 180000,
  MBB: 130000
};

function App() {
  const [views, setViews] = useState<View[]>([]);
  const [result, setResult] = useState<BlackLittermanResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [riskFreeRate, setRiskFreeRate] = useState(0.03);
  const [tau, setTau] = useState(0.05);
  const [marketCaps, setMarketCaps] = useState<Record<string, number>>(DEFAULT_CAPS);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [dataSource, setDataSource] = useState<'demo' | 'upload'>('demo');
  const [scenarios, setScenarios] = useState<Scenario[]>([]);

  const buildRequest = () => ({
    tickers: DEFAULT_TICKERS,
    market_caps: marketCaps,
    risk_free_rate: riskFreeRate,
    tau,
    views
  });

  const handleRun = async () => {
    setLoading(true);
    setError(null);
    try {
      const req = buildRequest();
      const res =
        dataSource === 'upload' && uploadFile
          ? await runUpload(req, uploadFile)
          : await runDemo(req);
      setResult(res);
      setScenarios((prev) => [
        {
          label: `Kịch bản ${prev.length + 1} (${views.length} quan điểm, nguồn: ${
            dataSource === 'upload' ? 'file tải lên' : 'demo'
          })`,
          response: res
        },
        ...prev
      ].slice(0, 5));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Loi khong xac dinh');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bl-app">
      <div className="bl-header">
        <div>
          <h1>
            <span className="bl-brand-mark">BL</span> Advisor
          </h1>
          <div className="bl-subtitle">
            Hệ thống hỗ trợ quyết định đầu tư danh mục ngành ngân hàng — Nguyễn Văn Trung, đồ án thực tập tốt nghiệp
          </div>
        </div>
        <button className="bl-btn" onClick={handleRun} disabled={loading}>
          {loading ? 'Đang tính...' : 'Chạy tối ưu hóa (dữ liệu demo)'}
        </button>
      </div>

      <div className="bl-warning-banner">
        Dữ liệu giá trong chế độ demo là dữ liệu tổng hợp (synthetic), chỉ để kiểm tra hệ thống.
        Kết quả không phản ánh thị trường thật.
      </div>

      {error && (
        <div className="bl-warning-banner" style={{ borderColor: 'var(--bl-danger)', color: 'var(--bl-danger)' }}>
          {error} — kiểm tra backend đã chạy ở http://127.0.0.1:8822 chưa.
        </div>
      )}

      <div className="bl-panel">
        <h2>Quan điểm nhà đầu tư (tùy chọn)</h2>
        <ViewsForm tickers={DEFAULT_TICKERS} views={views} onChange={setViews} />
      </div>

      {result && (
        <>
          {result.delta_is_fallback && (
            <div className="bl-warning-banner">
              Hệ số ngại rủi ro (delta) ước lượng từ dữ liệu không hợp lệ (âm), đã dùng giá trị mặc định 2,5
              (Grinold &amp; Kahn, 2000) thay thế.
            </div>
          )}

          <div className="bl-grid">
            <div className="bl-card">
              <div className="bl-card-label">Hệ số ngại rủi ro</div>
              <div className={`bl-card-value ${result.delta_is_fallback ? 'warn' : ''}`}>
                {result.delta.toFixed(2)}
              </div>
            </div>
            <div className="bl-card">
              <div className="bl-card-label">Số tài sản</div>
              <div className="bl-card-value">{result.tickers.length}</div>
            </div>
            <div className="bl-card">
              <div className="bl-card-label">Số quan điểm</div>
              <div className="bl-card-value">{views.length}</div>
            </div>
            <div className="bl-card">
              <div className="bl-card-label">Lợi suất E[R] cao nhất</div>
              <div className="bl-card-value">
                {(Math.max(...result.posterior_returns) * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="bl-panel">
            <h2>Phân bổ danh mục</h2>
            <div className="bl-two-col">
              <AllocationChart labels={result.tickers} values={result.weights_market} title="Trọng số thị trường" />
              <AllocationChart
                labels={result.tickers}
                values={result.weights_optimal}
                title="Trọng số tối ưu (sau Black-Litterman)"
              />
            </div>
          </div>

          <div className="bl-panel">
            <h2>Chi tiết từng mã</h2>
            <HoldingsTable result={result} />
          </div>
        </>
      )}

      <div className="bl-footer">
        BL Advisor — đồ án thực tập tốt nghiệp CNTT, PTIT. Mô hình: Black &amp; Litterman (1992).
        <br />
        Kiến trúc tham khảo dự án mã nguồn mở Ghostfolio (AGPL-3.0) — xem README.
      </div>
    </div>
  );
}

export default App;
