import React from 'react';

interface DiagramProps {
  type: string;
}

const BinaryDiagram = () => (
  <div className="diagram-container">
    <h4 className="diagram-title">基数変換チャート</h4>
    <svg viewBox="0 0 500 200" className="diagram-svg">
      {/* Boxes */}
      <rect x="10" y="60" width="110" height="80" rx="8" fill="#667eea" opacity="0.15" stroke="#667eea" strokeWidth="2"/>
      <text x="65" y="95" textAnchor="middle" fill="#4a5568" fontWeight="bold" fontSize="14">10進数</text>
      <text x="65" y="115" textAnchor="middle" fill="#667eea" fontSize="20" fontWeight="bold">26</text>

      <rect x="195" y="60" width="110" height="80" rx="8" fill="#48bb78" opacity="0.15" stroke="#48bb78" strokeWidth="2"/>
      <text x="250" y="95" textAnchor="middle" fill="#4a5568" fontWeight="bold" fontSize="14">2進数</text>
      <text x="250" y="115" textAnchor="middle" fill="#276749" fontSize="20" fontWeight="bold">11010</text>

      <rect x="380" y="60" width="110" height="80" rx="8" fill="#ed8936" opacity="0.15" stroke="#ed8936" strokeWidth="2"/>
      <text x="435" y="95" textAnchor="middle" fill="#4a5568" fontWeight="bold" fontSize="14">16進数</text>
      <text x="435" y="115" textAnchor="middle" fill="#c05621" fontSize="20" fontWeight="bold">1A</text>

      {/* Arrows */}
      <path d="M 120 100 L 190 100" stroke="#718096" strokeWidth="2" markerEnd="url(#arrow)"/>
      <text x="155" y="90" textAnchor="middle" fill="#718096" fontSize="11">÷2</text>

      <path d="M 305 100 L 375 100" stroke="#718096" strokeWidth="2" markerEnd="url(#arrow)"/>
      <text x="340" y="90" textAnchor="middle" fill="#718096" fontSize="11">4bit→1桁</text>

      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#718096"/>
        </marker>
      </defs>

      {/* Labels */}
      <text x="250" y="170" textAnchor="middle" fill="#718096" fontSize="12">例: 26₁₀ = 11010₂ = 1A₁₆</text>
    </svg>
  </div>
);

const LogicDiagram = () => (
  <div className="diagram-container">
    <h4 className="diagram-title">論理演算の真理値表</h4>
    <div className="truth-table-wrapper">
      <table className="truth-table">
        <thead>
          <tr>
            <th>A</th><th>B</th><th>A AND B</th><th>A OR B</th><th>A XOR B</th><th>NOT A</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>0</td><td>0</td><td className="and">0</td><td className="or">0</td><td className="xor">0</td><td className="not">1</td></tr>
          <tr><td>0</td><td>1</td><td className="and">0</td><td className="or">1</td><td className="xor">1</td><td className="not">1</td></tr>
          <tr><td>1</td><td>0</td><td className="and">0</td><td className="or">1</td><td className="xor">1</td><td className="not">0</td></tr>
          <tr><td>1</td><td>1</td><td className="and">1</td><td className="or">1</td><td className="xor">0</td><td className="not">0</td></tr>
        </tbody>
      </table>
    </div>
  </div>
);

const CpuDiagram = () => (
  <div className="diagram-container">
    <h4 className="diagram-title">コンピュータの5大装置</h4>
    <svg viewBox="0 0 520 240" className="diagram-svg">
      {/* CPU box */}
      <rect x="170" y="10" width="180" height="130" rx="10" fill="#667eea" opacity="0.1" stroke="#667eea" strokeWidth="2.5"/>
      <text x="260" y="32" textAnchor="middle" fill="#667eea" fontWeight="bold" fontSize="13">CPU</text>

      {/* Control unit */}
      <rect x="182" y="42" width="72" height="44" rx="6" fill="#667eea" opacity="0.2" stroke="#667eea" strokeWidth="1.5"/>
      <text x="218" y="61" textAnchor="middle" fill="#4a5568" fontSize="11" fontWeight="bold">制御装置</text>
      <text x="218" y="77" textAnchor="middle" fill="#4a5568" fontSize="10">命令解読</text>

      {/* ALU */}
      <rect x="264" y="42" width="72" height="44" rx="6" fill="#667eea" opacity="0.2" stroke="#667eea" strokeWidth="1.5"/>
      <text x="300" y="61" textAnchor="middle" fill="#4a5568" fontSize="11" fontWeight="bold">演算装置</text>
      <text x="300" y="77" textAnchor="middle" fill="#4a5568" fontSize="10">ALU</text>

      {/* Memory */}
      <rect x="182" y="96" width="154" height="34" rx="6" fill="#48bb78" opacity="0.2" stroke="#48bb78" strokeWidth="1.5"/>
      <text x="259" y="118" textAnchor="middle" fill="#276749" fontSize="11" fontWeight="bold">主記憶装置（RAM）</text>

      {/* Input */}
      <rect x="10" y="90" width="110" height="50" rx="8" fill="#ed8936" opacity="0.15" stroke="#ed8936" strokeWidth="2"/>
      <text x="65" y="111" textAnchor="middle" fill="#c05621" fontWeight="bold" fontSize="12">入力装置</text>
      <text x="65" y="127" textAnchor="middle" fill="#744210" fontSize="10">キーボード等</text>

      {/* Output */}
      <rect x="400" y="90" width="110" height="50" rx="8" fill="#9f7aea" opacity="0.15" stroke="#9f7aea" strokeWidth="2"/>
      <text x="455" y="111" textAnchor="middle" fill="#553c9a" fontWeight="bold" fontSize="12">出力装置</text>
      <text x="455" y="127" textAnchor="middle" fill="#44337a" fontSize="10">ディスプレイ等</text>

      {/* Storage */}
      <rect x="185" y="180" width="150" height="44" rx="8" fill="#fc8181" opacity="0.15" stroke="#fc8181" strokeWidth="2"/>
      <text x="260" y="199" textAnchor="middle" fill="#c53030" fontWeight="bold" fontSize="12">補助記憶装置</text>
      <text x="260" y="215" textAnchor="middle" fill="#822727" fontSize="10">HDD / SSD</text>

      {/* Arrows */}
      <path d="M 120 115 L 168 115" stroke="#ed8936" strokeWidth="2" markerEnd="url(#arrow2)"/>
      <path d="M 352 115 L 398 115" stroke="#9f7aea" strokeWidth="2" markerEnd="url(#arrow2)"/>
      <path d="M 260 144 L 260 178" stroke="#fc8181" strokeWidth="2" markerEnd="url(#arrow2)"/>

      <defs>
        <marker id="arrow2" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#718096"/>
        </marker>
      </defs>
    </svg>
  </div>
);

const OsiDiagram = () => (
  <div className="diagram-container">
    <h4 className="diagram-title">OSI参照モデル</h4>
    <div className="osi-layers">
      {[
        { num: 7, name: 'アプリケーション層', protocol: 'HTTP, FTP, DNS', color: '#667eea' },
        { num: 6, name: 'プレゼンテーション層', protocol: '暗号化, 文字コード変換', color: '#764ba2' },
        { num: 5, name: 'セッション層', protocol: 'セッション管理', color: '#9f7aea' },
        { num: 4, name: 'トランスポート層', protocol: 'TCP, UDP', color: '#48bb78' },
        { num: 3, name: 'ネットワーク層', protocol: 'IP, ICMP', color: '#38a169' },
        { num: 2, name: 'データリンク層', protocol: 'Ethernet, MACアドレス', color: '#ed8936' },
        { num: 1, name: '物理層', protocol: '電気信号, ビット', color: '#fc8181' },
      ].map(layer => (
        <div key={layer.num} className="osi-layer" style={{ borderLeftColor: layer.color }}>
          <span className="osi-num" style={{ background: layer.color }}>第{layer.num}層</span>
          <span className="osi-name">{layer.name}</span>
          <span className="osi-protocol">{layer.protocol}</span>
        </div>
      ))}
    </div>
  </div>
);

const StackQueueDiagram = () => (
  <div className="diagram-container">
    <h4 className="diagram-title">スタック vs キュー</h4>
    <div className="stack-queue-wrapper">
      <div className="ds-box">
        <div className="ds-title" style={{ color: '#667eea' }}>スタック（LIFO）</div>
        <svg viewBox="0 0 120 160" width="120" height="160">
          <rect x="20" y="10" width="80" height="30" rx="4" fill="#667eea" opacity="0.8"/>
          <text x="60" y="30" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">3</text>
          <rect x="20" y="48" width="80" height="30" rx="4" fill="#667eea" opacity="0.6"/>
          <text x="60" y="68" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">2</text>
          <rect x="20" y="86" width="80" height="30" rx="4" fill="#667eea" opacity="0.4"/>
          <text x="60" y="106" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">1</text>
          <line x1="20" y1="125" x2="100" y2="125" stroke="#4a5568" strokeWidth="3"/>
          <text x="60" y="145" textAnchor="middle" fill="#718096" fontSize="11">↑ 3から取り出す</text>
        </svg>
        <div className="ds-note">後から入れたものが先に出る</div>
      </div>
      <div className="ds-box">
        <div className="ds-title" style={{ color: '#48bb78' }}>キュー（FIFO）</div>
        <svg viewBox="0 0 180 100" width="180" height="100">
          <rect x="10" y="30" width="40" height="40" rx="4" fill="#48bb78" opacity="0.4"/>
          <text x="30" y="55" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">1</text>
          <rect x="60" y="30" width="40" height="40" rx="4" fill="#48bb78" opacity="0.6"/>
          <text x="80" y="55" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">2</text>
          <rect x="110" y="30" width="40" height="40" rx="4" fill="#48bb78" opacity="0.8"/>
          <text x="130" y="55" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">3</text>
          <text x="10" y="20" fill="#718096" fontSize="10">← 取り出す</text>
          <text x="130" y="90" textAnchor="middle" fill="#718096" fontSize="10">追加 →</text>
        </svg>
        <div className="ds-note">先に入れたものが先に出る</div>
      </div>
    </div>
  </div>
);

const SecurityDiagram = () => (
  <div className="diagram-container">
    <h4 className="diagram-title">情報セキュリティのCIA</h4>
    <svg viewBox="0 0 400 220" className="diagram-svg">
      <circle cx="200" cy="100" r="90" fill="none" stroke="#e2e8f0" strokeWidth="2"/>

      <circle cx="200" cy="50" r="55" fill="#667eea" opacity="0.2" stroke="#667eea" strokeWidth="2"/>
      <text x="200" y="42" textAnchor="middle" fill="#4a5568" fontWeight="bold" fontSize="13">機密性</text>
      <text x="200" y="58" textAnchor="middle" fill="#667eea" fontSize="11">Confidentiality</text>

      <circle cx="140" cy="148" r="55" fill="#48bb78" opacity="0.2" stroke="#48bb78" strokeWidth="2"/>
      <text x="140" y="140" textAnchor="middle" fill="#4a5568" fontWeight="bold" fontSize="13">完全性</text>
      <text x="140" y="156" textAnchor="middle" fill="#48bb78" fontSize="11">Integrity</text>

      <circle cx="260" cy="148" r="55" fill="#ed8936" opacity="0.2" stroke="#ed8936" strokeWidth="2"/>
      <text x="260" y="140" textAnchor="middle" fill="#4a5568" fontWeight="bold" fontSize="13">可用性</text>
      <text x="260" y="156" textAnchor="middle" fill="#ed8936" fontSize="11">Availability</text>

      <text x="200" y="105" textAnchor="middle" fill="#4a5568" fontSize="16" fontWeight="bold">CIA</text>

      <text x="200" y="200" textAnchor="middle" fill="#718096" fontSize="11">情報セキュリティの三大要素</text>
    </svg>
  </div>
);

const SortDiagram = () => (
  <div className="diagram-container">
    <h4 className="diagram-title">バブルソートの動き（例: [5,3,1]）</h4>
    <div className="sort-steps">
      {[
        { label: '初期', arr: [5, 3, 1], highlight: [] },
        { label: 'パス1', arr: [3, 1, 5], highlight: [2] },
        { label: 'パス2', arr: [1, 3, 5], highlight: [1, 2] },
        { label: '完了', arr: [1, 2, 3].map((_, i) => [1, 3, 5][i]), highlight: [0, 1, 2] },
      ].map((step, si) => (
        <div key={si} className="sort-step">
          <span className="sort-label">{step.label}</span>
          <div className="sort-bars">
            {step.arr.map((val, i) => (
              <div key={i} className="sort-bar-wrap">
                <div
                  className="sort-bar"
                  style={{
                    height: `${val * 14}px`,
                    background: step.highlight.includes(i) ? '#48bb78' : '#667eea',
                  }}
                />
                <span className="sort-val">{val}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const FlowchartDiagram = () => (
  <div className="diagram-container">
    <h4 className="diagram-title">制御構造のフローチャート</h4>
    <svg viewBox="0 0 300 240" className="diagram-svg">
      {/* Start */}
      <ellipse cx="150" cy="20" rx="50" ry="16" fill="#667eea" opacity="0.8"/>
      <text x="150" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">開始</text>

      {/* Process */}
      <rect x="90" y="55" width="120" height="35" rx="4" fill="#667eea" opacity="0.2" stroke="#667eea" strokeWidth="1.5"/>
      <text x="150" y="78" textAnchor="middle" fill="#4a5568" fontSize="11">x ← 0</text>

      {/* Diamond */}
      <polygon points="150,108 210,130 150,152 90,130" fill="#ed8936" opacity="0.2" stroke="#ed8936" strokeWidth="1.5"/>
      <text x="150" y="126" textAnchor="middle" fill="#744210" fontSize="10" fontWeight="bold">x &lt; 5 ?</text>
      <text x="150" y="140" textAnchor="middle" fill="#744210" fontSize="10">True/False</text>

      {/* Process 2 */}
      <rect x="90" y="165" width="120" height="35" rx="4" fill="#48bb78" opacity="0.2" stroke="#48bb78" strokeWidth="1.5"/>
      <text x="150" y="188" textAnchor="middle" fill="#276749" fontSize="11">x ← x + 1</text>

      {/* End */}
      <ellipse cx="150" cy="224" rx="50" ry="14" fill="#718096" opacity="0.6"/>
      <text x="150" y="229" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">終了</text>

      {/* Arrows */}
      <path d="M 150 36 L 150 54" stroke="#718096" strokeWidth="1.5" markerEnd="url(#a3)"/>
      <path d="M 150 90 L 150 107" stroke="#718096" strokeWidth="1.5" markerEnd="url(#a3)"/>
      <path d="M 150 153 L 150 164" stroke="#718096" strokeWidth="1.5" markerEnd="url(#a3)"/>
      <path d="M 150 200 L 150 209" stroke="#718096" strokeWidth="1.5" markerEnd="url(#a3)"/>
      {/* Loop back arrow */}
      <path d="M 90 130 Q 40 130 40 182 Q 40 220 90 220" stroke="#ed8936" strokeWidth="1.5" fill="none" markerEnd="url(#a3)"/>
      <text x="30" y="182" fill="#c05621" fontSize="9">True</text>
      <text x="85" y="225" fill="#718096" fontSize="9">False</text>

      <defs>
        <marker id="a3" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#718096"/>
        </marker>
      </defs>
    </svg>
  </div>
);

const ClockDiagram = () => (
  <div className="diagram-container">
    <h4 className="diagram-title">CPU性能の計算式</h4>
    <div className="formula-box">
      <div className="formula">
        <span className="formula-label">実行時間</span>
        <span className="formula-eq">=</span>
        <span className="formula-num">命令数 × CPI</span>
        <span className="formula-div">÷</span>
        <span className="formula-denom">クロック周波数</span>
      </div>
      <div className="formula" style={{ marginTop: '16px' }}>
        <span className="formula-label">MIPS</span>
        <span className="formula-eq">=</span>
        <span className="formula-num">クロック周波数(MHz)</span>
        <span className="formula-div">÷</span>
        <span className="formula-denom">CPI</span>
      </div>
      <div className="formula-example">
        例: 2GHz ÷ CPI4 = <strong>500 MIPS</strong>
      </div>
    </div>
  </div>
);

const diagrams: Record<string, React.FC> = {
  binary: BinaryDiagram,
  logic: LogicDiagram,
  cpu: CpuDiagram,
  osi: OsiDiagram,
  'stack-queue': StackQueueDiagram,
  security: SecurityDiagram,
  sort: SortDiagram,
  flowchart: FlowchartDiagram,
  clock: ClockDiagram,
};

const Diagram: React.FC<DiagramProps> = ({ type }) => {
  const Component = diagrams[type];
  if (!Component) return null;
  return <Component />;
};

export default Diagram;
