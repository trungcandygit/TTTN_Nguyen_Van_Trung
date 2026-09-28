import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const PALETTE = ['#47dbd7', '#4895df', '#9ecaff', '#00a19f', '#b2c8e8', '#267bc3'];

interface Props {
  labels: string[];
  values: number[];
  title: string;
}

export function AllocationChart({ labels, values, title }: Props) {
  const data = labels.map((l, i) => ({ name: l, value: Math.max(values[i], 0) }));

  return (
    <div>
      <div style={{ fontSize: 12, color: 'var(--bl-text-dim)', marginBottom: 8 }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 160, height: 160, flexShrink: 0 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data} dataKey="value" innerRadius={45} outerRadius={72} paddingAngle={2}>
                {data.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => `${(Number(v) * 100).toFixed(1)}%`}
                contentStyle={{ background: '#2a2a2a', border: '1px solid #3a3a3a', borderRadius: 8 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
          {data.map((d, i) => (
            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: PALETTE[i % PALETTE.length],
                  display: 'inline-block'
                }}
              />
              <span style={{ minWidth: 48 }}>{d.name}</span>
              <span style={{ color: 'var(--bl-text-dim)' }}>{(d.value * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
