export interface Question {
  id: number;
  question: string;
  choices: string[];
  answer: number; // 0-indexed
  explanation: string;
}

export interface Section {
  id: string;
  title: string;
  content: string; // markdown-like HTML string
  diagram?: string; // SVG or description key
  questions: Question[];
}

export interface Chapter {
  id: string;
  title: string;
  subject: 'A' | 'B';
  description: string;
  sections: Section[];
}

const baseChapters: Chapter[] = [
  {
    id: 'a1',
    title: '基礎理論',
    subject: 'A',
    description: '2進数・16進数・補数・論理演算・シフト演算・情報量など、ITの土台となる数学的基礎を徹底解説します。',
    sections: [
      {
        id: 'a1-1',
        title: '2進数・8進数・16進数の基本',
        content: `
<h3>なぜ2進数を使うのか</h3>
<p>コンピュータは無数の電子スイッチ（トランジスタ）で動いています。スイッチは「ON（1）」か「OFF（0）」の2状態しか持てないため、すべてのデータを<strong>2進数</strong>で表現します。</p>
<p>2進数の1桁を <strong>ビット（bit）</strong>、8ビットをまとめたものを <strong>バイト（byte）</strong> と呼びます。</p>

<h3>各基数の対応表</h3>
<p>10進数・2進数・8進数・16進数の対応を覚えておきましょう。16進数は <code>0〜9, A〜F</code> の16種類で表します。</p>

<h3>10進数 → 2進数への変換（割り算法）</h3>
<p>数を基数で<strong>割り続けて余りを下から読む</strong>方法が基本です。</p>
<p>例: 10進数の <code>45</code> を2進数に変換</p>
<ul>
  <li>45 ÷ 2 = 22 … 余り <strong>1</strong></li>
  <li>22 ÷ 2 = 11 … 余り <strong>0</strong></li>
  <li>11 ÷ 2 = 5 … 余り <strong>1</strong></li>
  <li>5 ÷ 2 = 2 … 余り <strong>1</strong></li>
  <li>2 ÷ 2 = 1 … 余り <strong>0</strong></li>
  <li>1 ÷ 2 = 0 … 余り <strong>1</strong></li>
</ul>
<p>余りを下から読むと → <code>101101</code>(2) ✓</p>

<h3>2進数 → 10進数への変換（重み法）</h3>
<p>各桁に2の累乗（重み）を掛けて合計します。</p>
<p>例: <code>1011</code>(2) を10進数に変換</p>
<p><code>1×2³ + 0×2² + 1×2¹ + 1×2⁰ = 8 + 0 + 2 + 1 = <strong>11</strong></code></p>

<h3>2進数 ↔ 16進数の変換</h3>
<p>2進数<strong>4桁</strong>が16進数<strong>1桁</strong>に対応します。4桁ずつ区切ってすばやく変換できます。</p>
<p>例: <code>1010 1111</code>(2) = <code>A</code> <code>F</code> = <code>AF</code>(16)</p>
<p>例: <code>3C</code>(16) = <code>0011 1100</code>(2)</p>

<h3>2進数の四則演算</h3>
<p><strong>加算ルール</strong>: 0+0=0, 0+1=1, 1+0=1, 1+1=10（桁上がり）</p>
<p>例: <code>1011 + 0110 = 10001</code></p>
        `,
        diagram: 'binary',
        questions: [
          {
            id: 1,
            question: '10進数の 26 を2進数に変換したものはどれか。',
            choices: ['10110', '11010', '11001', '10011'],
            answer: 1,
            explanation: '26 ÷ 2 を繰り返すと余りが 0,1,0,1,1 → 下から読んで 11010 です。確認: 16+8+2=26 ✓',
          },
          {
            id: 2,
            question: '16進数の FF を10進数に変換したものはどれか。',
            choices: ['240', '255', '256', '128'],
            answer: 1,
            explanation: 'F=15 なので 15×16 + 15×1 = 240 + 15 = 255 です。',
          },
          {
            id: 101,
            question: '2進数の 1101 を10進数に変換したものはどれか。',
            choices: ['11', '12', '13', '14'],
            answer: 2,
            explanation: '1×8 + 1×4 + 0×2 + 1×1 = 8+4+0+1 = 13 です。',
          },
          {
            id: 102,
            question: '2進数 4桁で表せる最大の10進数はいくつか。',
            choices: ['8', '15', '16', '32'],
            answer: 1,
            explanation: '2進数4桁の最大値は 1111(2) = 8+4+2+1 = 15 です。n桁で表せる最大値は 2ⁿ-1 です。',
          },
        ],
      },
      {
        id: 'a1-2',
        title: '補数表現と負の数',
        content: `
<h3>補数とは</h3>
<p>コンピュータは「引き算」を直接行わず、<strong>補数を使った足し算</strong>に変換して処理します。これにより回路をシンプルに保てます。</p>

<h3>2の補数（負の数の表現）</h3>
<p>コンピュータで負の数を表すには<strong>2の補数</strong>を使います。</p>
<p>求め方は2ステップです：</p>
<ol>
  <li>元の数のビットを全部<strong>反転</strong>する（0→1、1→0）</li>
  <li>反転した数に <strong>1を加える</strong></li>
</ol>
<p>例: <code>+5（0101）</code> の2の補数を求める</p>
<ul>
  <li>ビット反転 → <code>1010</code></li>
  <li>1を加える → <code>1011</code></li>
</ul>
<p>つまり <code>1011</code> が <code>-5</code> を表します。</p>

<h3>符号付き整数の範囲</h3>
<p>nビットの符号付き整数（2の補数）で表せる範囲は <code>-2ⁿ⁻¹ ～ 2ⁿ⁻¹-1</code> です。</p>
<ul>
  <li>8ビット（1バイト）: <strong>-128 ～ 127</strong></li>
  <li>16ビット（2バイト）: -32,768 ～ 32,767</li>
  <li>32ビット（4バイト）: 約 -21億 ～ 21億</li>
</ul>

<h3>最上位ビット（MSB）と符号</h3>
<p>符号付き整数では<strong>最上位ビット（MSB）</strong>が符号を表します。</p>
<ul>
  <li>MSB = 0 → 正の数</li>
  <li>MSB = 1 → 負の数</li>
</ul>

<h3>オーバーフロー</h3>
<p>計算結果が表現できる範囲を超えることを<strong>オーバーフロー</strong>といいます。8ビット符号付きで 127+1 を計算すると -128 になってしまいます。</p>
        `,
        diagram: 'complement',
        questions: [
          {
            id: 103,
            question: '8ビットの符号付き2進数で表せる最小値はどれか。',
            choices: ['-255', '-128', '-127', '0'],
            answer: 1,
            explanation: 'nビット符号付きの最小値は -2ⁿ⁻¹ です。8ビットなら -2⁷ = -128 です。',
          },
          {
            id: 104,
            question: '2進数 0101(+5) の2の補数はどれか。',
            choices: ['1010', '1011', '0110', '1001'],
            answer: 1,
            explanation: 'ビット反転(0101→1010)して1を加える(1010+1=1011)。よって1011が-5を表します。',
          },
        ],
      },
      {
        id: 'a1-3',
        title: '論理演算とシフト演算',
        content: `
<h3>論理演算の基本4種</h3>
<p>ビット単位で行う演算です。プログラムのフラグ操作やマスク処理に多用されます。</p>
<ul>
  <li><strong>AND（論理積）</strong>: 両方1のとき1。「かつ」。特定ビットを0にする「マスク」に使う。</li>
  <li><strong>OR（論理和）</strong>: 片方でも1なら1。「または」。特定ビットを1にするのに使う。</li>
  <li><strong>NOT（否定）</strong>: 0↔1を反転。</li>
  <li><strong>XOR（排他的論理和）</strong>: 異なるとき1、同じとき0。ビットの反転・比較に使う。</li>
</ul>

<h3>ド・モルガンの法則</h3>
<p>論理式の変形に使う重要な法則です。</p>
<ul>
  <li><code>NOT(A AND B) = NOT(A) OR NOT(B)</code></li>
  <li><code>NOT(A OR B) = NOT(A) AND NOT(B)</code></li>
</ul>

<h3>シフト演算</h3>
<p>ビット列を左右にずらす演算です。<strong>2の累乗の掛け算・割り算</strong>を高速に行えます。</p>
<ul>
  <li><strong>左シフト（&lt;&lt;）</strong>: nビット左にずらす → 2ⁿ倍。例: <code>0011 &lt;&lt; 2 = 1100</code>（3→12）</li>
  <li><strong>右シフト（&gt;&gt;）</strong>: nビット右にずらす → 2ⁿで割る。例: <code>1100 &gt;&gt; 2 = 0011</code>（12→3）</li>
</ul>
<p><strong>算術シフト</strong>: 符号ビットを保持したままシフト（符号付き整数向け）</p>
<p><strong>論理シフト</strong>: 符号ビットも含めてシフト（符号なし整数向け）</p>
        `,
        diagram: 'logic',
        questions: [
          {
            id: 3,
            question: 'A=1, B=0 のとき、A AND B の結果はどれか。',
            choices: ['0', '1', '2', '-1'],
            answer: 0,
            explanation: 'ANDは両方が1のときだけ1です。Bが0なので結果は0です。',
          },
          {
            id: 4,
            question: 'A=1, B=0 のとき、A XOR B の結果はどれか。',
            choices: ['0', '1', '-1', '2'],
            answer: 1,
            explanation: 'XORは2値が異なるとき1です。A=1, B=0 は異なるので結果は1です。',
          },
          {
            id: 105,
            question: '10進数の 3 を2ビット左シフトした結果はどれか。',
            choices: ['6', '9', '12', '24'],
            answer: 2,
            explanation: '左シフト2ビットは ×2² = ×4 です。3 × 4 = 12 です。',
          },
          {
            id: 106,
            question: 'NOT(A AND B) と同じ論理式はどれか（ド・モルガンの法則）。',
            choices: ['NOT(A) AND NOT(B)', 'NOT(A) OR NOT(B)', 'A OR B', 'A AND B'],
            answer: 1,
            explanation: 'ド・モルガンの法則: NOT(A AND B) = NOT(A) OR NOT(B) です。',
          },
        ],
      },
      {
        id: 'a1-4',
        title: '浮動小数点数と誤差',
        content: `
<h3>浮動小数点数とは</h3>
<p>小数や非常に大きな数・小さな数を表すための形式です。コンピュータでは<strong>IEEE 754</strong>規格が広く使われています。</p>
<p>表現形式: <code>±1.仮数部 × 2^指数部</code></p>

<h3>IEEE 754（単精度・32ビット）の構造</h3>
<ul>
  <li><strong>符号部</strong>: 1ビット（0=正、1=負）</li>
  <li><strong>指数部</strong>: 8ビット（実際の指数+127）</li>
  <li><strong>仮数部</strong>: 23ビット（小数点以下のビット）</li>
</ul>

<h3>浮動小数点数の誤差</h3>
<p>コンピュータで小数を扱うと誤差が生じることがあります。</p>
<ul>
  <li><strong>丸め誤差</strong>: 指定した桁数に丸めることで生じる誤差</li>
  <li><strong>桁落ち</strong>: 近い値の差を求めると有効桁数が減る誤差</li>
  <li><strong>情報落ち</strong>: 絶対値の大きく異なる数の加算で小さい数の影響が無視される</li>
  <li><strong>けた溢れ（オーバーフロー）</strong>: 表現できる最大値を超える</li>
</ul>
<p>例: <code>0.1 + 0.2 = 0.30000000000000004</code>（JavaScriptなどで確認できる）</p>
        `,
        diagram: 'floatingpoint',
        questions: [
          {
            id: 107,
            question: '浮動小数点数で、値が近い2数の差を求めたとき有効桁数が減る誤差を何というか。',
            choices: ['丸め誤差', '桁落ち', '情報落ち', 'オーバーフロー'],
            answer: 1,
            explanation: '桁落ちは値が近い数同士の差を取ったとき、上位桁が打ち消し合って有効桁数が減少する現象です。',
          },
          {
            id: 108,
            question: 'IEEE 754の単精度浮動小数点数は何ビットか。',
            choices: ['16', '32', '64', '128'],
            answer: 1,
            explanation: 'IEEE 754の単精度（float）は32ビット（符号1+指数8+仮数23）、倍精度（double）は64ビットです。',
          },
        ],
      },
      {
        id: 'a1-5',
        title: '情報量とエンコーディング',
        content: `
<h3>情報量の単位</h3>
<p>データの大きさを表す単位を覚えましょう。</p>
<ul>
  <li><strong>1 bit</strong>: 0か1かの1桁</li>
  <li><strong>1 byte = 8 bit</strong></li>
  <li><strong>1 KB（キロバイト）= 1,024 byte = 2¹⁰ byte</strong></li>
  <li><strong>1 MB（メガバイト）= 1,024 KB = 2²⁰ byte</strong></li>
  <li><strong>1 GB（ギガバイト）= 1,024 MB = 2³⁰ byte</strong></li>
  <li><strong>1 TB（テラバイト）= 1,024 GB = 2⁴⁰ byte</strong></li>
</ul>

<h3>文字コード</h3>
<p>文字を数値で表すための規則（文字コード）です。</p>
<ul>
  <li><strong>ASCII</strong>: 英数字・記号を7ビット（128文字）で表現。最も基本的な文字コード。</li>
  <li><strong>Shift_JIS</strong>: 日本語（ひらがな・漢字）を含む文字コード。主にWindowsで使用。</li>
  <li><strong>UTF-8</strong>: 世界中の文字を扱えるUnicodeの符号化形式。Webの標準。英字は1バイト、日本語は3バイト。</li>
  <li><strong>UTF-16</strong>: 基本的に2バイト固定。Javaの内部表現などで使用。</li>
</ul>

<h3>データ容量の計算例</h3>
<p>例: 1文字2バイトの文字コードで、1000文字のテキストを保存するのに必要な容量は？</p>
<p>1000文字 × 2バイト = <strong>2,000バイト ≈ 2 KB</strong></p>

<p>例: 解像度1920×1080ピクセル、1ピクセル24ビット（RGB各8ビット）の画像の容量は？</p>
<p>1920 × 1080 × 24ビット = 49,766,400ビット = 6,220,800バイト ≈ <strong>約6 MB</strong></p>
        `,
        diagram: 'datasize',
        questions: [
          {
            id: 109,
            question: '1 MBは何バイトか。',
            choices: ['1,000バイト', '1,024バイト', '1,048,576バイト', '1,000,000バイト'],
            answer: 2,
            explanation: '1 MB = 2²⁰ byte = 1,024 × 1,024 = 1,048,576バイトです。SI単位（10⁶）と混同しないよう注意。',
          },
          {
            id: 110,
            question: 'Webページの文字エンコーディングとして現在最も広く使われているものはどれか。',
            choices: ['ASCII', 'Shift_JIS', 'UTF-8', 'EUC-JP'],
            answer: 2,
            explanation: 'UTF-8はUnicodeの符号化方式で、世界中の文字を表現でき、現在のWebの標準文字コードです。',
          },
          {
            id: 111,
            question: '1文字を3バイトで表す文字コードを使用したとき、500文字のデータは何バイトか。',
            choices: ['500', '1,000', '1,500', '2,000'],
            answer: 2,
            explanation: '500文字 × 3バイト/文字 = 1,500バイトです。',
          },
        ],
      },
    ],
  },
  {
    id: 'a2',
    title: 'コンピュータの構成',
    subject: 'A',
    description: 'CPU・メモリ階層・命令実行サイクル・入出力など、コンピュータの仕組みを深く学びます。',
    sections: [
      {
        id: 'a2-1',
        title: 'コンピュータの5大装置',
        content: `
<h3>コンピュータの5大装置</h3>
<p>コンピュータはどんなに複雑に見えても、本質的に5つの装置で構成されています。</p>
<ul>
  <li><strong>制御装置</strong>: プログラムの命令を解読し、各装置に指示を出す「司令塔」。プログラムカウンタ（PC）が次に実行する命令のアドレスを保持する。</li>
  <li><strong>演算装置（ALU）</strong>: 四則演算・論理演算・比較演算を実行する。</li>
  <li><strong>記憶装置</strong>: データやプログラムを保存する（主記憶・補助記憶）。</li>
  <li><strong>入力装置</strong>: 外部からデータを取り込む（キーボード・マウス・スキャナ等）。</li>
  <li><strong>出力装置</strong>: 処理結果を外部に出力する（ディスプレイ・プリンタ・スピーカ等）。</li>
</ul>
<p>制御装置と演算装置を合わせたものが <strong>CPU（中央処理装置）</strong> です。</p>

<h3>CPUの内部レジスタ</h3>
<p>CPUは超高速な記憶素子（レジスタ）を内部に持ちます。</p>
<ul>
  <li><strong>プログラムカウンタ（PC）</strong>: 次に実行する命令のメモリアドレスを保持</li>
  <li><strong>命令レジスタ（IR）</strong>: 現在実行中の命令を保持</li>
  <li><strong>アキュムレータ（ACC）</strong>: 演算結果を一時保存</li>
  <li><strong>汎用レジスタ</strong>: 計算の途中結果などを保存</li>
  <li><strong>フラグレジスタ</strong>: 演算結果の状態（ゼロ・桁溢れ・負など）を記録</li>
</ul>

<h3>主記憶（RAM）と補助記憶</h3>
<p><strong>主記憶（RAM）</strong>: 高速だが電源を切るとデータが消える<strong>揮発性</strong>メモリ。CPUが直接アクセスできる作業領域。</p>
<p><strong>ROM</strong>: 読み出し専用の不揮発性メモリ。BIOSなどの起動プログラムを格納。</p>
<p><strong>補助記憶（HDD/SSD）</strong>: 大容量で不揮発性。主記憶より遅いがデータを永続保存。</p>
        `,
        diagram: 'cpu',
        questions: [
          {
            id: 5,
            question: 'CPUに含まれる装置の組み合わせとして正しいものはどれか。',
            choices: ['制御装置と演算装置', '制御装置と記憶装置', '演算装置と入力装置', '記憶装置と出力装置'],
            answer: 0,
            explanation: 'CPUは制御装置（命令解読）と演算装置（ALU）を合わせたものです。',
          },
          {
            id: 6,
            question: '電源を切るとデータが消える記憶装置はどれか。',
            choices: ['HDD', 'SSD', 'RAM', 'ROM'],
            answer: 2,
            explanation: 'RAM（主記憶）は揮発性メモリで、電源オフでデータが消えます。HDD・SSD・ROMは不揮発性です。',
          },
          {
            id: 201,
            question: '次に実行する命令のアドレスを保持するCPU内のレジスタはどれか。',
            choices: ['アキュムレータ', 'フラグレジスタ', 'プログラムカウンタ', '命令レジスタ'],
            answer: 2,
            explanation: 'プログラムカウンタ（PC）は次に実行する命令のメモリアドレスを保持します。命令実行のたびに自動的に更新されます。',
          },
        ],
      },
      {
        id: 'a2-2',
        title: '命令実行サイクルとパイプライン',
        content: `
<h3>命令実行の4ステップ</h3>
<p>CPUは命令を次の順序で繰り返し処理します。</p>
<ol>
  <li><strong>フェッチ（Fetch）</strong>: プログラムカウンタが指すアドレスから命令を主記憶より読み込む</li>
  <li><strong>デコード（Decode）</strong>: 読み込んだ命令を解読して何をすべきか判断する</li>
  <li><strong>実行（Execute）</strong>: ALUが演算を実行する</li>
  <li><strong>ライトバック（Write Back）</strong>: 演算結果をレジスタやメモリに書き戻す</li>
</ol>

<h3>パイプライン処理</h3>
<p>複数の命令を<strong>並行して</strong>実行する技術です。工場のベルトコンベアのように、各ステージが異なる命令を同時処理します。</p>
<p>4段パイプライン（理想的な場合）: 4命令の実行が4+3=7クロックで完了（逐次処理なら4×4=16クロック）</p>

<h3>パイプラインハザード</h3>
<p>パイプラインが正常に流れなくなる状況を<strong>ハザード</strong>といいます。</p>
<ul>
  <li><strong>データハザード</strong>: 前の命令の結果を次の命令がすぐ必要とする場合</li>
  <li><strong>制御ハザード</strong>: 条件分岐で次に実行する命令が確定しない場合</li>
  <li><strong>構造ハザード</strong>: 複数の命令が同じハードウェア資源を使おうとする場合</li>
</ul>

<h3>スーパースカラとマルチコア</h3>
<p><strong>スーパースカラ</strong>: 複数のパイプラインを持ち、1クロックで複数命令を同時実行。</p>
<p><strong>マルチコア</strong>: 1チップ上に複数のCPUコアを搭載。真の並列処理が可能。</p>
        `,
        diagram: 'pipeline',
        questions: [
          {
            id: 202,
            question: 'CPUの命令実行サイクルの正しい順序はどれか。',
            choices: [
              'デコード → フェッチ → 実行 → ライトバック',
              'フェッチ → デコード → 実行 → ライトバック',
              'フェッチ → 実行 → デコード → ライトバック',
              '実行 → フェッチ → デコード → ライトバック',
            ],
            answer: 1,
            explanation: '命令実行サイクルはフェッチ（読み込み）→デコード（解読）→実行（演算）→ライトバック（書き戻し）の順です。',
          },
          {
            id: 203,
            question: 'パイプライン処理の説明として正しいものはどれか。',
            choices: [
              '1つの命令を複数のCPUで分担して実行する',
              '複数の命令を各ステージで並行して処理する',
              'キャッシュメモリを使って命令を高速に読み込む',
              '命令をまとめてバッチ処理する',
            ],
            answer: 1,
            explanation: 'パイプラインは命令のフェッチ・デコード・実行・ライトバックを並行して行うことでスループットを向上させます。',
          },
        ],
      },
      {
        id: 'a2-3',
        title: 'CPUの性能指標と計算',
        content: `
<h3>クロック周波数</h3>
<p>CPUが1秒間に刻むサイクル数です。単位は <strong>Hz（ヘルツ）</strong>。3GHzなら1秒に30億回処理できます。クロック周波数が高いほど速いですが、発熱も増えます。</p>

<h3>CPI（Cycles Per Instruction）</h3>
<p>1命令を実行するのに必要な<strong>平均クロック数</strong>です。CPIが小さいほど効率が良い。</p>

<h3>MIPS（Million Instructions Per Second）</h3>
<p>1秒間に実行できる命令数を百万単位で表した性能指標です。</p>
<p><code>MIPS = クロック周波数(MHz) ÷ CPI</code></p>

<h3>実行時間の計算</h3>
<p><code>実行時間(秒) = 命令数 × CPI ÷ クロック周波数(Hz)</code></p>
<p>例: 命令数100万、CPI=4、クロック周波数=2GHz の場合</p>
<p><code>実行時間 = 1,000,000 × 4 ÷ 2,000,000,000 = 0.002秒 = 2ミリ秒</code></p>

<h3>アムダールの法則</h3>
<p>プログラムの一部を高速化したとき、全体の高速化の上限を示す法則です。</p>
<p>並列化できない部分が全体の20%あれば、何万台のCPUを使っても最大5倍にしかなりません。</p>
        `,
        diagram: 'clock',
        questions: [
          {
            id: 7,
            question: 'クロック周波数が 2GHz、CPI が 4 のとき、MIPSはいくつか。',
            choices: ['500', '250', '8000', '2000'],
            answer: 0,
            explanation: 'MIPS = クロック周波数(MHz) ÷ CPI = 2000MHz ÷ 4 = 500MIPS です。',
          },
          {
            id: 204,
            question: 'クロック周波数3GHz、CPI=3、命令数9億のプログラムの実行時間はいくつか。',
            choices: ['0.3秒', '0.9秒', '1秒', '3秒'],
            answer: 1,
            explanation: '実行時間 = 9億 × 3 ÷ 3,000,000,000 = 27億 ÷ 30億 = 0.9秒です。',
          },
        ],
      },
      {
        id: 'a2-4',
        title: 'メモリ階層とキャッシュ',
        content: `
<h3>メモリ階層</h3>
<p>コンピュータのメモリは<strong>速度・容量・コスト</strong>のトレードオフによって階層構造になっています。CPUに近いほど速く、高価で、小容量です。</p>

<h3>各メモリの特徴</h3>
<ul>
  <li><strong>レジスタ</strong>: CPU内部。最高速。数十〜数百バイト程度。</li>
  <li><strong>キャッシュメモリ（L1/L2/L3）</strong>: CPU内〜CPU近傍。数KB〜数十MB。主記憶より100倍以上高速。</li>
  <li><strong>主記憶（RAM）</strong>: 数GB〜数十GB。CPUから直接アクセス可能。</li>
  <li><strong>補助記憶（SSD/HDD）</strong>: 数百GB〜数TB。主記憶より1000倍以上遅い。</li>
</ul>

<h3>キャッシュメモリの仕組み</h3>
<p>よく使うデータをCPUの近くに置いておき、主記憶へのアクセスを減らす技術です。</p>
<p><strong>ヒット率</strong>: キャッシュにデータがあった割合。ヒット率が高いほど高速になります。</p>
<p><strong>実効アクセス時間</strong> = ヒット率 × キャッシュアクセス時間 + (1-ヒット率) × 主記憶アクセス時間</p>
<p>例: ヒット率90%、キャッシュ10ns、主記憶100ns の場合</p>
<p><code>= 0.9 × 10 + 0.1 × 100 = 9 + 10 = 19ns</code></p>

<h3>局所性の原理</h3>
<p>キャッシュが効果的な理由はプログラムの<strong>局所性</strong>にあります。</p>
<ul>
  <li><strong>時間的局所性</strong>: 最近使ったデータはすぐにまた使われる（ループ変数など）</li>
  <li><strong>空間的局所性</strong>: あるアドレスのデータを使ったら、近くのアドレスも使われやすい（配列など）</li>
</ul>
        `,
        diagram: 'memoryhierarchy',
        questions: [
          {
            id: 205,
            question: 'ヒット率80%、キャッシュアクセス時間5ns、主記憶アクセス時間100nsのとき、実効アクセス時間はいくつか。',
            choices: ['24ns', '20ns', '80ns', '100ns'],
            answer: 0,
            explanation: '実効アクセス時間 = 0.8×5 + 0.2×100 = 4 + 20 = 24ns です。',
          },
          {
            id: 206,
            question: 'キャッシュメモリに関する説明として正しいものはどれか。',
            choices: [
              '主記憶よりも容量が大きい',
              'CPUと主記憶の速度差を緩和するための高速メモリ',
              '電源を切ってもデータが消えない不揮発性メモリ',
              '補助記憶装置の一種である',
            ],
            answer: 1,
            explanation: 'キャッシュメモリはCPUと低速な主記憶の間の速度差を埋めるための高速バッファです。',
          },
        ],
      },
      {
        id: 'a2-5',
        title: '入出力とバス',
        content: `
<h3>バス（Bus）</h3>
<p>CPU・主記憶・入出力装置を接続するデータの「高速道路」です。</p>
<ul>
  <li><strong>データバス</strong>: データを転送する。ビット幅が広いほど一度に多くのデータを転送できる。</li>
  <li><strong>アドレスバス</strong>: メモリのアドレスを指定する。32ビットで最大4GBのメモリをアドレス指定可能。</li>
  <li><strong>制御バス</strong>: 読み書きなどの制御信号を伝える。</li>
</ul>

<h3>入出力方式</h3>
<ul>
  <li><strong>プログラムI/O（ポーリング）</strong>: CPUが入出力装置の状態を定期的に確認する。CPUが専有されてしまうのでムダが多い。</li>
  <li><strong>割り込みI/O</strong>: 入出力装置の準備ができたら割り込み信号でCPUに通知する。CPUを有効活用できる。</li>
  <li><strong>DMA（Direct Memory Access）</strong>: DMAコントローラがCPUを介さずに入出力装置と主記憶間でデータ転送する。CPUの負荷を大幅に削減できる。</li>
</ul>

<h3>インタフェース規格</h3>
<ul>
  <li><strong>USB（Universal Serial Bus）</strong>: 最も普及した汎用インタフェース。ホットプラグ対応。</li>
  <li><strong>HDMI</strong>: 映像・音声を1本のケーブルで伝送。</li>
  <li><strong>PCIe（PCI Express）</strong>: グラフィックカードなど高速デバイス向けの内部バス規格。</li>
  <li><strong>SATA / NVMe</strong>: ストレージ接続規格。NVMeはSATAの数倍高速。</li>
</ul>
        `,
        diagram: 'bus',
        questions: [
          {
            id: 207,
            question: 'DMA（Direct Memory Access）の説明として正しいものはどれか。',
            choices: [
              'CPUが主導して入出力装置とデータを転送する方式',
              'CPUを介さずに入出力装置と主記憶間でデータ転送する方式',
              '入出力装置がCPUに割り込みをかけてデータを通知する方式',
              'CPUが一定時間ごとに入出力装置を確認する方式',
            ],
            answer: 1,
            explanation: 'DMAはDMAコントローラがCPUを介さずに主記憶と入出力装置間のデータ転送を行うため、CPUを他の処理に使えます。',
          },
          {
            id: 208,
            question: 'アドレスバスが32ビットのとき、アドレス指定できる主記憶の最大容量はいくつか。',
            choices: ['2GB', '4GB', '8GB', '16GB'],
            answer: 1,
            explanation: '32ビットで表せるアドレス数は2³² = 約43億。1アドレス=1バイトなら 2³² byte = 4GB です。',
          },
        ],
      },
    ],
  },
  {
    id: 'a3',
    title: 'ネットワーク',
    subject: 'A',
    description: 'OSI参照モデル・TCP/IP・IPアドレス・DNS・ルーティングなど、ネットワークの仕組みを体系的に学びます。',
    sections: [
      {
        id: 'a3-1',
        title: 'OSI参照モデルとTCP/IP',
        content: `
<h3>OSI参照モデル（7層）</h3>
<p>ネットワークの機能を7つの層（レイヤー）に分けた国際標準モデルです。異なるメーカーの機器でも通信できるよう、各層の役割と接続方法を規定しています。</p>
<ol>
  <li><strong>物理層</strong>: ビットを電気信号・光信号に変換。ケーブル・ハブが該当。</li>
  <li><strong>データリンク層</strong>: 同一ネットワーク内の通信。<strong>MACアドレス</strong>で機器を識別。スイッチが該当。</li>
  <li><strong>ネットワーク層</strong>: 異なるネットワーク間の経路制御。<strong>IPアドレス</strong>を使用。ルータが該当。</li>
  <li><strong>トランスポート層</strong>: エンドツーエンドの信頼性確保。<strong>TCP / UDP</strong>が該当。</li>
  <li><strong>セッション層</strong>: 通信セッションの確立・維持・終了を管理。</li>
  <li><strong>プレゼンテーション層</strong>: データの形式変換・暗号化・圧縮。</li>
  <li><strong>アプリケーション層</strong>: ユーザーが使うアプリのプロトコル（HTTP・FTP・DNS・SMTP）。</li>
</ol>

<h3>TCP/IP の4層モデル</h3>
<p>実際のインターネットはTCP/IPという4層モデルで動いています。OSIモデルとの対応を把握しましょう。</p>
<ul>
  <li><strong>ネットワークインタフェース層</strong>（OSI第1〜2層相当）: イーサネット・Wi-Fi</li>
  <li><strong>インターネット層</strong>（OSI第3層相当）: IP・ICMP・ARP</li>
  <li><strong>トランスポート層</strong>（OSI第4層相当）: TCP・UDP</li>
  <li><strong>アプリケーション層</strong>（OSI第5〜7層相当）: HTTP・FTP・DNS・SMTP</li>
</ul>

<h3>TCPとUDPの違い</h3>
<p><strong>TCP（Transmission Control Protocol）</strong></p>
<ul>
  <li>3ウェイハンドシェイク（SYN → SYN-ACK → ACK）で接続を確立</li>
  <li>受信確認（ACK）があり、パケットロス時は再送する</li>
  <li>順序制御・フロー制御・輻輳制御あり</li>
  <li>用途: HTTP/HTTPS・メール・FTP（正確性が必要な通信）</li>
</ul>
<p><strong>UDP（User Datagram Protocol）</strong></p>
<ul>
  <li>コネクションレス。受信確認なし。再送なし。</li>
  <li>オーバーヘッドが小さく高速</li>
  <li>用途: 動画ストリーミング・VoIP・DNS・オンラインゲーム（速さ優先）</li>
</ul>
        `,
        diagram: 'osi',
        questions: [
          {
            id: 8,
            question: 'IPアドレスを扱う層はOSI参照モデルの第何層か。',
            choices: ['第2層（データリンク層）', '第3層（ネットワーク層）', '第4層（トランスポート層）', '第7層（アプリケーション層）'],
            answer: 1,
            explanation: 'IPアドレスはネットワーク層（第3層）で扱われます。MACアドレスはデータリンク層（第2層）です。',
          },
          {
            id: 9,
            question: '動画ストリーミングに適したプロトコルはどれか。',
            choices: ['TCP', 'UDP', 'HTTP', 'FTP'],
            answer: 1,
            explanation: 'UDPは受信確認がなく高速なため、多少のパケットロスを許容できる動画配信に適しています。',
          },
          {
            id: 301,
            question: 'TCPの3ウェイハンドシェイクの手順として正しいものはどれか。',
            choices: [
              'ACK → SYN → SYN-ACK',
              'SYN → SYN-ACK → ACK',
              'SYN-ACK → SYN → ACK',
              'SYN → ACK → SYN-ACK',
            ],
            answer: 1,
            explanation: 'TCPの接続確立はSYN（接続要求）→SYN-ACK（確認応答）→ACK（確認）の3ステップです。',
          },
        ],
      },
      {
        id: 'a3-2',
        title: 'IPアドレスとサブネット',
        content: `
<h3>IPアドレスとは</h3>
<p>ネットワーク上の機器を一意に識別する番号です。現在はIPv4（32ビット）とIPv6（128ビット）が使われています。</p>

<h3>IPv4アドレスの構造</h3>
<p>32ビットを8ビットずつ4つに区切り、10進数でドット区切りで表します。</p>
<p>例: <code>192.168.1.10</code> → <code>11000000.10101000.00000001.00001010</code></p>
<p>IPアドレスは<strong>ネットワーク部</strong>（どのネットワークか）と<strong>ホスト部</strong>（そのネットワーク内のどの機器か）に分かれます。</p>

<h3>サブネットマスク</h3>
<p>ネットワーク部とホスト部の境界を示すビット列です。</p>
<p>例: <code>255.255.255.0</code>（= /24）なら上位24ビットがネットワーク部、下位8ビットがホスト部。</p>
<p>このとき同一ネットワーク内のホスト数は <code>2⁸ - 2 = 254台</code>（ネットワークアドレスとブロードキャストアドレスを除く）。</p>

<h3>特殊なIPアドレス</h3>
<ul>
  <li><strong>ネットワークアドレス</strong>: ホスト部が全て0。ネットワーク自体を表す。</li>
  <li><strong>ブロードキャストアドレス</strong>: ホスト部が全て1。同一ネットワーク全体への送信。</li>
  <li><strong>ループバックアドレス</strong>: <code>127.0.0.1</code>。自分自身を指す。テスト用。</li>
  <li><strong>プライベートアドレス</strong>: <code>10.x.x.x</code> / <code>172.16〜31.x.x</code> / <code>192.168.x.x</code>。LAN内専用。</li>
</ul>

<h3>CIDR表記</h3>
<p>サブネットマスクをビット数で表す方法です。<code>192.168.1.0/24</code> は「192.168.1.0のネットワーク、マスク長24ビット」を意味します。</p>

<h3>IPv6</h3>
<p>IPv4のアドレス枯渇問題を解決するために作られた128ビットのアドレス体系です。<code>2001:0db8:85a3::8a2e:0370:7334</code> のように16進数でコロン区切りで表します。約340澗個（3.4×10³⁸）のアドレスが使えます。</p>
        `,
        diagram: 'ipaddress',
        questions: [
          {
            id: 302,
            question: 'サブネットマスク 255.255.255.0 (/24) のネットワークで使用できるホストアドレスの数はいくつか。',
            choices: ['253', '254', '255', '256'],
            answer: 1,
            explanation: 'ホスト部8ビットで2⁸=256通りありますが、ネットワークアドレス(0)とブロードキャスト(255)を除くと254台です。',
          },
          {
            id: 303,
            question: 'プライベートIPアドレスの範囲として正しいものはどれか。',
            choices: ['8.8.8.0/24', '192.168.0.0/16', '127.0.0.0/8', '224.0.0.0/4'],
            answer: 1,
            explanation: '192.168.0.0〜192.168.255.255はプライベートアドレス範囲です。8.8.8.xはGoogleのDNS（グローバル）、127.x.x.xはループバック、224.x.x.xはマルチキャストです。',
          },
        ],
      },
      {
        id: 'a3-3',
        title: 'DNSとルーティング',
        content: `
<h3>DNS（Domain Name System）</h3>
<p>ドメイン名（例: <code>www.example.com</code>）をIPアドレスに変換するシステムです。電話帳のような役割を果たします。</p>

<h3>名前解決の流れ</h3>
<ol>
  <li>ブラウザが <code>www.example.com</code> にアクセスしようとする</li>
  <li>PCがDNSキャッシュを確認（なければDNSサーバに問い合わせ）</li>
  <li>ルートDNSサーバ → TLDサーバ（.com担当）→ 権威DNSサーバの順に再帰的に問い合わせ</li>
  <li>IPアドレスをキャッシュして返す</li>
</ol>

<h3>主要なプロトコルとポート番号</h3>
<p>ポート番号はアプリケーションを識別する番号（0〜65535）です。ウェルノウンポートは0〜1023。</p>
<ul>
  <li><strong>HTTP</strong>: 80番 / <strong>HTTPS</strong>: 443番（Webページ）</li>
  <li><strong>FTP</strong>: 21番（ファイル転送）</li>
  <li><strong>SSH</strong>: 22番（安全なリモート接続）</li>
  <li><strong>SMTP</strong>: 25番（メール送信）</li>
  <li><strong>POP3</strong>: 110番 / <strong>IMAP</strong>: 143番（メール受信）</li>
  <li><strong>DNS</strong>: 53番</li>
  <li><strong>DHCP</strong>: 67/68番（IPアドレスの自動割り当て）</li>
</ul>

<h3>ルーティング</h3>
<p>パケットを宛先IPアドレスに向けて転送する経路選択のことです。</p>
<ul>
  <li><strong>スタティックルーティング</strong>: 管理者が手動で経路を設定。小規模ネットワーク向け。</li>
  <li><strong>ダイナミックルーティング</strong>: ルーティングプロトコル（OSPF・BGP等）で自動的に経路を学習・更新。大規模ネットワーク向け。</li>
</ul>

<h3>NAT（Network Address Translation）</h3>
<p>プライベートIPアドレスをグローバルIPアドレスに変換する技術です。1つのグローバルIPを複数の端末で共有でき、IPv4アドレス枯渇を緩和します。<strong>NAPT（IPマスカレード）</strong>はポート番号も変換して多対一の変換を行います。</p>
        `,
        diagram: 'dns',
        questions: [
          {
            id: 304,
            question: 'HTTPSが使用するウェルノウンポート番号はどれか。',
            choices: ['80', '443', '22', '53'],
            answer: 1,
            explanation: 'HTTPSは443番ポートを使用します。HTTPは80番、SSHは22番、DNSは53番です。',
          },
          {
            id: 305,
            question: 'DNSの役割として正しいものはどれか。',
            choices: [
              'IPアドレスをMACアドレスに変換する',
              'ドメイン名をIPアドレスに変換する',
              'プライベートIPをグローバルIPに変換する',
              'パケットを宛先に転送する経路を決める',
            ],
            answer: 1,
            explanation: 'DNSはドメイン名（www.example.comなど）をIPアドレスに変換する名前解決サービスです。',
          },
        ],
      },
      {
        id: 'a3-4',
        title: 'LAN・WAN・無線ネットワーク',
        content: `
<h3>LAN と WAN</h3>
<p><strong>LAN（Local Area Network）</strong>: 建物内や構内など限られた範囲のネットワーク。高速・低コスト。</p>
<p><strong>WAN（Wide Area Network）</strong>: 地理的に離れた場所を結ぶネットワーク。インターネットもWANの一種。</p>

<h3>イーサネット（有線LAN）</h3>
<p>有線LANの標準規格です。CSMA/CD方式で衝突を検知します。</p>
<ul>
  <li><strong>100BASE-TX</strong>: 最大100Mbps。ツイストペアケーブル（CAT5）。</li>
  <li><strong>1000BASE-T（ギガビットイーサネット）</strong>: 最大1Gbps。CAT5e以上。</li>
  <li><strong>10GBASE-T</strong>: 最大10Gbps。サーバー間接続などに使用。</li>
</ul>

<h3>無線LAN（Wi-Fi）</h3>
<p>IEEE 802.11シリーズの規格です。</p>
<ul>
  <li><strong>802.11n（Wi-Fi 4）</strong>: 最大600Mbps。2.4GHz/5GHz両対応。</li>
  <li><strong>802.11ac（Wi-Fi 5）</strong>: 最大6.9Gbps。5GHz帯。</li>
  <li><strong>802.11ax（Wi-Fi 6）</strong>: 最大9.6Gbps。混雑環境での効率が向上。</li>
</ul>

<h3>ネットワーク機器</h3>
<ul>
  <li><strong>ハブ（リピータハブ）</strong>: 全ポートに同じデータを送信。第1層。</li>
  <li><strong>スイッチ（L2スイッチ）</strong>: MACアドレスで宛先を判断して転送。第2層。</li>
  <li><strong>ルータ</strong>: IPアドレスで経路を判断して転送。第3層。異なるネットワーク間を接続。</li>
  <li><strong>ファイアウォール</strong>: パケットを監視してアクセス制御。不正通信を遮断。</li>
</ul>

<h3>VPN（Virtual Private Network）</h3>
<p>インターネット上に仮想的な専用線を構築し、安全に通信する技術です。テレワークで社内ネットワークに接続する際に使用します。データは暗号化されて転送されます。</p>
        `,
        diagram: 'network-devices',
        questions: [
          {
            id: 306,
            question: 'MACアドレスをもとにパケットを転送するネットワーク機器はどれか。',
            choices: ['ルータ', 'L2スイッチ', 'リピータハブ', 'ファイアウォール'],
            answer: 1,
            explanation: 'L2スイッチ（レイヤ2スイッチ）はMACアドレステーブルを参照して宛先ポートにのみ転送します。ルータはIPアドレスを使用します。',
          },
          {
            id: 307,
            question: 'テレワークで社内ネットワークに安全に接続するために使われる技術はどれか。',
            choices: ['DNS', 'DHCP', 'VPN', 'NAT'],
            answer: 2,
            explanation: 'VPN（仮想プライベートネットワーク）はインターネット上に暗号化された仮想専用線を構築し、安全なリモートアクセスを実現します。',
          },
        ],
      },
      {
        id: 'a3-5',
        title: 'HTTP・メール・その他のプロトコル',
        content: `
<h3>HTTP / HTTPS</h3>
<p>Webページの転送に使うプロトコルです。</p>
<p><strong>HTTP</strong>: テキストで通信する。盗聴・改ざんのリスクあり。</p>
<p><strong>HTTPS</strong>: <strong>TLS（Transport Layer Security）</strong>で暗号化。証明書で相手を認証。現在のWebの標準。</p>

<h3>HTTPの主なメソッド</h3>
<ul>
  <li><strong>GET</strong>: データを取得する（URLにパラメータ付加）</li>
  <li><strong>POST</strong>: データを送信する（フォーム送信など）</li>
  <li><strong>PUT</strong>: データを更新・作成する</li>
  <li><strong>DELETE</strong>: データを削除する</li>
</ul>

<h3>メールプロトコル</h3>
<ul>
  <li><strong>SMTP（25番）</strong>: メールの<strong>送信</strong>に使用</li>
  <li><strong>POP3（110番）</strong>: メールをサーバからダウンロードして受信。ダウンロード後はサーバから削除。</li>
  <li><strong>IMAP（143番）</strong>: メールをサーバ上で管理。複数デバイスから同じメールを参照できる。</li>
</ul>

<h3>DHCP（Dynamic Host Configuration Protocol）</h3>
<p>ネットワークに接続した端末に自動的にIPアドレス・サブネットマスク・デフォルトゲートウェイ・DNSサーバのアドレスを割り当てるプロトコルです。</p>

<h3>SNMP・NTP</h3>
<p><strong>SNMP</strong>: ネットワーク機器の監視・管理に使うプロトコル。</p>
<p><strong>NTP（Network Time Protocol）</strong>: ネットワーク上の機器の時刻を同期させるプロトコル。</p>
        `,
        diagram: 'http',
        questions: [
          {
            id: 308,
            question: 'メールをサーバ上で管理し、複数デバイスから参照できるプロトコルはどれか。',
            choices: ['SMTP', 'POP3', 'IMAP', 'FTP'],
            answer: 2,
            explanation: 'IMAPはメールをサーバ上に保存したまま管理するため、スマートフォン・PCなど複数端末で同じ受信ボックスを参照できます。',
          },
          {
            id: 309,
            question: 'ネットワークに接続した端末に自動的にIPアドレスを割り当てるプロトコルはどれか。',
            choices: ['DNS', 'DHCP', 'NAT', 'SNMP'],
            answer: 1,
            explanation: 'DHCPサーバが接続端末にIPアドレス・サブネットマスク・デフォルトゲートウェイなどを自動的に割り当てます。',
          },
        ],
      },
    ],
  },
  {
    id: 'a4',
    title: 'セキュリティ',
    subject: 'A',
    description: '情報セキュリティの三大要素・攻撃手法・暗号技術を学びます。',
    sections: [
      {
        id: 'a4-1',
        title: '情報セキュリティの基本',
        content: `
<h3>CIA（セキュリティの三大要素）</h3>
<ul>
  <li><strong>機密性（Confidentiality）</strong>: 許可された人だけが情報にアクセスできる</li>
  <li><strong>完全性（Integrity）</strong>: 情報が正確で改ざんされていない</li>
  <li><strong>可用性（Availability）</strong>: 必要なときに情報を利用できる</li>
</ul>

<h3>主な攻撃手法</h3>
<p><strong>フィッシング</strong>: 偽サイトへ誘導してパスワードを盗む</p>
<p><strong>DoS攻撃</strong>: 大量のリクエストでサーバーをダウンさせる</p>
<p><strong>SQLインジェクション</strong>: 不正なSQL文を入力してDBを操作する</p>
<p><strong>XSS（クロスサイトスクリプティング）</strong>: 悪意あるスクリプトをWebページに埋め込む</p>
        `,
        diagram: 'security',
        questions: [
          {
            id: 10,
            question: '情報セキュリティのCIAのうち「可用性」の説明として正しいものはどれか。',
            choices: [
              '許可された人だけが情報にアクセスできる',
              '情報が改ざんされていない状態を保つ',
              '必要なときに情報を利用できる状態を保つ',
              '情報を暗号化して保護する',
            ],
            answer: 2,
            explanation: '可用性（Availability）とは、必要なときに情報やシステムを利用できることです。',
          },
        ],
      },
    ],
  },
  {
    id: 'b1',
    title: 'アルゴリズムとデータ構造',
    subject: 'B',
    description: '科目Bの核心。配列・スタック・キュー・ソートアルゴリズムを擬似コードで学びます。',
    sections: [
      {
        id: 'b1-1',
        title: '配列とリスト',
        content: `
<h3>配列（Array）</h3>
<p>同じ型のデータを連続した番地に並べたデータ構造です。インデックスで素早くアクセスできます。</p>
<p>アクセス時間: <strong>O(1)</strong>（一定時間）</p>
<p>挿入・削除: <strong>O(n)</strong>（要素をずらす必要あり）</p>

<h3>配列の基本操作（擬似コード）</h3>
<pre>
// 配列の初期化
配列 A ← [10, 20, 30, 40, 50]

// インデックス2の要素を表示
表示する(A[2])  // → 30

// 合計を求める
合計 ← 0
i を 0 から 4 まで繰り返す:
    合計 ← 合計 + A[i]
表示する(合計)  // → 150
</pre>

<h3>スタック（Stack）</h3>
<p><strong>LIFO（後入れ先出し）</strong>のデータ構造。プッシュ（追加）とポップ（取り出し）が基本操作。</p>
<p>例: 関数の呼び出し履歴、元に戻す（Undo）機能</p>

<h3>キュー（Queue）</h3>
<p><strong>FIFO（先入れ先出し）</strong>のデータ構造。エンキュー（追加）とデキュー（取り出し）が基本操作。</p>
<p>例: プリンタの印刷待ちキュー、タスクスケジューリング</p>
        `,
        diagram: 'stack-queue',
        questions: [
          {
            id: 11,
            question: 'スタックに 1, 2, 3 の順でプッシュした後、2回ポップすると取り出せる値はどれか（2回目）。',
            choices: ['1', '2', '3', '4'],
            answer: 1,
            explanation: 'LIFOなので取り出し順は 3→2→1 です。2回目のポップで取り出せるのは 2 です。',
          },
          {
            id: 12,
            question: 'キューに 1, 2, 3 の順でエンキューした後、2回デキューすると取り出せる値はどれか（2回目）。',
            choices: ['1', '2', '3', '4'],
            answer: 1,
            explanation: 'FIFOなので取り出し順は 1→2→3 です。2回目のデキューで取り出せるのは 2 です。',
          },
        ],
      },
      {
        id: 'b1-2',
        title: '整列アルゴリズム',
        content: `
<h3>バブルソート</h3>
<p>隣り合う要素を比較して交換を繰り返す。計算量: <strong>O(n²)</strong></p>
<pre>
配列 A ← [5, 3, 1, 4, 2]
n ← Aの要素数

i を 0 から n-2 まで繰り返す:
    j を 0 から n-2-i まで繰り返す:
        もし A[j] > A[j+1] なら:
            A[j] と A[j+1] を交換する
// 結果: [1, 2, 3, 4, 5]
</pre>

<h3>二分探索</h3>
<p><strong>ソート済み</strong>の配列を半分ずつ絞り込んで検索する。計算量: <strong>O(log n)</strong></p>
<pre>
関数 二分探索(A, 目標値):
    左 ← 0
    右 ← Aの要素数 - 1

    左 <= 右 の間繰り返す:
        中央 ← (左 + 右) ÷ 2 の整数部分
        もし A[中央] = 目標値 なら:
            中央を返す
        そうでなく A[中央] < 目標値 なら:
            左 ← 中央 + 1
        そうでなければ:
            右 ← 中央 - 1

    -1 を返す  // 見つからなかった
</pre>
        `,
        diagram: 'sort',
        questions: [
          {
            id: 13,
            question: 'バブルソートの平均計算量はどれか。',
            choices: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
            answer: 3,
            explanation: 'バブルソートはn個の要素に対して最大n²/2回の比較が必要なのでO(n²)です。',
          },
          {
            id: 14,
            question: '二分探索が使える前提条件はどれか。',
            choices: [
              '配列がソート済みであること',
              '配列の要素が整数であること',
              '配列のサイズが偶数であること',
              '重複する要素がないこと',
            ],
            answer: 0,
            explanation: '二分探索は配列が昇順または降順にソートされていることが前提条件です。',
          },
        ],
      },
    ],
  },
  {
    id: 'b2',
    title: 'プログラミング基礎',
    subject: 'B',
    description: '変数・条件分岐・繰り返し・関数など、プログラミングの基本構造を擬似コードで学びます。',
    sections: [
      {
        id: 'b2-1',
        title: '変数と制御構造',
        content: `
<h3>変数と代入</h3>
<p>変数はデータを入れる「箱」です。基本情報技術者試験では「←」が代入を表します。</p>
<pre>
x ← 10        // xに10を代入
y ← x + 5    // yに15を代入
x ← x * 2   // xを20に更新
</pre>

<h3>条件分岐</h3>
<pre>
点数 ← 75

もし 点数 >= 60 なら:
    表示する("合格")
そうでなければ:
    表示する("不合格")
</pre>

<h3>繰り返し（for・while）</h3>
<pre>
// 1から10の合計
合計 ← 0
i を 1 から 10 まで繰り返す:
    合計 ← 合計 + i
表示する(合計)  // → 55

// 条件付き繰り返し
n ← 1
n <= 100 の間繰り返す:
    n ← n * 2
表示する(n)  // → 128
</pre>
        `,
        diagram: 'flowchart',
        questions: [
          {
            id: 15,
            question: '次の擬似コードの実行結果はどれか。\n\nx ← 1\nx <= 5 の間繰り返す:\n    x ← x + 2\n表示する(x)',
            choices: ['5', '6', '7', '8'],
            answer: 2,
            explanation: 'x: 1→3→5→7。x=7のとき 7>5 になりループを抜けるので結果は7です。',
          },
        ],
      },
    ],
  },
];

// ===== 追加章 =====

const additionalChapters: Chapter[] = [
  {
    id: 'a5',
    title: 'ソフトウェア',
    subject: 'A',
    description: 'OS・ファイルシステム・仮想化など、ソフトウェアの基本を学びます。',
    sections: [
      {
        id: 'a5-1',
        title: 'オペレーティングシステム（OS）',
        content: `
<h3>OSとは</h3>
<p>OS（Operating System）はハードウェアとアプリケーションの橋渡しをする基本ソフトウェアです。Windows・macOS・Linuxが代表例です。</p>

<h3>OSの主な機能</h3>
<ul>
  <li><strong>プロセス管理</strong>: 複数のプログラムを同時に実行（マルチタスク）</li>
  <li><strong>メモリ管理</strong>: プログラムにメモリを割り当て・回収する</li>
  <li><strong>ファイル管理</strong>: ファイルの作成・読み書き・削除を管理</li>
  <li><strong>デバイス管理</strong>: キーボード・ディスクなどの入出力を制御</li>
</ul>

<h3>プロセスのスケジューリング</h3>
<p>CPUは1つしかないため、複数のプロセスを短い時間で切り替えながら処理します。これを<strong>タイムシェアリング</strong>といいます。</p>
<p><strong>ラウンドロビン方式</strong>: 各プロセスに均等な時間（タイムスライス）を割り当てる。公平だが切り替えのオーバーヘッドあり。</p>
<p><strong>優先度方式</strong>: 優先度の高いプロセスを先に実行する。</p>

<h3>仮想記憶</h3>
<p>物理メモリが不足したとき、ディスクの一部をメモリとして使う仕組みです。実際より大きなメモリがあるように見せかけます。</p>
<p>ディスクをメモリとして使う領域を<strong>スワップ領域（ページファイル）</strong>といいます。</p>
        `,
        diagram: 'os',
        questions: [
          {
            id: 20,
            question: 'OSのプロセス管理の説明として正しいものはどれか。',
            choices: [
              '1つのCPUで複数のプロセスを切り替えながら実行する',
              'プロセスごとに専用のCPUを割り当てる',
              'メモリを複数のプロセスで共有せず独占させる',
              'ディスクの読み書きを高速化する',
            ],
            answer: 0,
            explanation: 'タイムシェアリングにより、1つのCPUを短い時間で切り替えながら複数プロセスを並行実行します。',
          },
          {
            id: 21,
            question: '仮想記憶の説明として正しいものはどれか。',
            choices: [
              'CPUの処理速度を向上させる技術',
              'ディスクの一部を主記憶として利用する技術',
              'ネットワーク経由でメモリを拡張する技術',
              'キャッシュメモリを増やす技術',
            ],
            answer: 1,
            explanation: '仮想記憶はディスクの一部をスワップ領域として使い、物理メモリより大きなアドレス空間を実現します。',
          },
        ],
      },
      {
        id: 'a5-2',
        title: 'ファイルシステムと仮想化',
        content: `
<h3>ファイルシステム</h3>
<p>ディスク上のデータを<strong>ファイル</strong>と<strong>ディレクトリ（フォルダ）</strong>で管理する仕組みです。</p>
<p>代表的なファイルシステム: FAT32・NTFS（Windows）、ext4（Linux）、APFS（macOS）</p>

<h3>パス</h3>
<p><strong>絶対パス</strong>: ルートディレクトリから記述する。例: <code>/home/user/document.txt</code></p>
<p><strong>相対パス</strong>: 現在位置から記述する。例: <code>../document.txt</code>（1つ上のフォルダ）</p>

<h3>仮想化</h3>
<p>1台の物理サーバー上で複数の仮想マシン（VM）を動かす技術です。</p>
<ul>
  <li><strong>ホスト型仮想化</strong>: 既存OSの上に仮想化ソフトを導入（VirtualBox等）</li>
  <li><strong>ハイパーバイザー型</strong>: ハードウェア上に直接仮想化層を置く。高性能（VMware ESXi等）</li>
  <li><strong>コンテナ型</strong>: OSカーネルを共有して軽量に分離（Docker等）</li>
</ul>
        `,
        diagram: 'filesystem',
        questions: [
          {
            id: 22,
            question: 'ルートディレクトリからのファイルの場所を示すパスを何というか。',
            choices: ['相対パス', '絶対パス', 'フルパス名', 'カレントパス'],
            answer: 1,
            explanation: 'ルートから記述するパスを絶対パスといいます（フルパスとも呼ばれます）。',
          },
        ],
      },
    ],
  },
  {
    id: 'a6',
    title: 'データベース',
    subject: 'A',
    description: 'SQL・正規化・ER図など、データベースの基礎を学びます。',
    sections: [
      {
        id: 'a6-1',
        title: 'リレーショナルデータベースとSQL',
        content: `
<h3>リレーショナルデータベース（RDB）</h3>
<p>データを<strong>表（テーブル）</strong>の形式で管理するデータベースです。行（レコード）と列（フィールド）で構成されます。</p>

<h3>主キーと外部キー</h3>
<p><strong>主キー（Primary Key）</strong>: 各行を一意に識別するフィールド。重複・NULLは不可。</p>
<p><strong>外部キー（Foreign Key）</strong>: 別のテーブルの主キーを参照するフィールド。テーブル間の関係を定義する。</p>

<h3>SQL基本命令</h3>
<pre>
-- データ取得
SELECT 氏名, 年齢 FROM 社員 WHERE 年齢 >= 30;

-- データ挿入
INSERT INTO 社員 (氏名, 年齢) VALUES ('田中', 25);

-- データ更新
UPDATE 社員 SET 年齢 = 26 WHERE 氏名 = '田中';

-- データ削除
DELETE FROM 社員 WHERE 氏名 = '田中';

-- テーブル結合
SELECT 社員.氏名, 部署.部署名
FROM 社員
INNER JOIN 部署 ON 社員.部署ID = 部署.部署ID;
</pre>
        `,
        diagram: 'database',
        questions: [
          {
            id: 23,
            question: '各行を一意に識別するためのフィールドを何というか。',
            choices: ['外部キー', '主キー', 'インデックス', 'ビュー'],
            answer: 1,
            explanation: '主キー（Primary Key）は各レコードを一意に識別するフィールドで、重複やNULLは許可されません。',
          },
          {
            id: 24,
            question: 'SQLでデータを取得するときに使う命令はどれか。',
            choices: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'],
            answer: 2,
            explanation: 'SELECTはテーブルからデータを取得する命令です。',
          },
        ],
      },
      {
        id: 'a6-2',
        title: '正規化とトランザクション',
        content: `
<h3>正規化</h3>
<p>データの冗長性を排除してデータの整合性を保つための設計手法です。</p>
<ul>
  <li><strong>第1正規形</strong>: 各フィールドが原子値（繰り返しグループを排除）</li>
  <li><strong>第2正規形</strong>: 第1正規形 + 部分関数従属を排除</li>
  <li><strong>第3正規形</strong>: 第2正規形 + 推移関数従属を排除</li>
</ul>

<h3>トランザクション</h3>
<p>一連のデータ操作を<strong>一つの処理単位</strong>として扱う仕組みです。</p>
<p>例: 銀行振込では「口座Aから引き落とし」と「口座Bへの入金」が両方成功するか、両方失敗するかのどちらかでなければなりません。</p>

<h3>ACID特性</h3>
<ul>
  <li><strong>原子性（Atomicity）</strong>: 全て成功か全て失敗か</li>
  <li><strong>一貫性（Consistency）</strong>: 処理前後でデータの整合性が保たれる</li>
  <li><strong>独立性（Isolation）</strong>: 複数のトランザクションが互いに干渉しない</li>
  <li><strong>耐久性（Durability）</strong>: 完了したトランザクションは障害後も保持される</li>
</ul>
        `,
        diagram: 'transaction',
        questions: [
          {
            id: 25,
            question: 'トランザクションのACID特性のうち「原子性」の説明として正しいものはどれか。',
            choices: [
              'トランザクションが完全に実行されるか、全く実行されないかのどちらかである',
              'トランザクションが並行実行されても互いに干渉しない',
              'コミット後のデータは障害が発生しても失われない',
              'トランザクション前後でデータの整合性が保たれる',
            ],
            answer: 0,
            explanation: '原子性（Atomicity）とは、トランザクションが全て成功（コミット）するか全て失敗（ロールバック）するかの二択であることです。',
          },
        ],
      },
    ],
  },
  {
    id: 'a7',
    title: 'システム開発',
    subject: 'A',
    description: '要件定義・設計・テスト・アジャイルなど、ソフトウェア開発のプロセスを学びます。',
    sections: [
      {
        id: 'a7-1',
        title: 'ソフトウェア開発プロセス',
        content: `
<h3>ウォーターフォールモデル</h3>
<p>要件定義→設計→実装→テスト→運用の順に<strong>一方向に</strong>進める開発手法です。</p>
<ul>
  <li>各工程が完了してから次の工程へ進む</li>
  <li>計画が立てやすく、大規模プロジェクトに向く</li>
  <li>要件変更に対応しにくいのがデメリット</li>
</ul>

<h3>アジャイル開発</h3>
<p>短い開発サイクル（<strong>スプリント</strong>）を繰り返しながら、柔軟に要件変更に対応する手法です。</p>
<p>代表的な手法: <strong>スクラム</strong>・XP（エクストリームプログラミング）</p>

<h3>開発工程と成果物</h3>
<ul>
  <li><strong>要件定義</strong>: 何を作るかを決める → 要件定義書</li>
  <li><strong>外部設計</strong>: 画面・帳票など外から見える設計 → 外部設計書</li>
  <li><strong>内部設計</strong>: モジュール構造・データ構造の設計 → 内部設計書</li>
  <li><strong>実装</strong>: コーディング → ソースコード</li>
  <li><strong>テスト</strong>: 動作確認 → テスト報告書</li>
</ul>
        `,
        diagram: 'waterfall',
        questions: [
          {
            id: 26,
            question: 'ウォーターフォールモデルの特徴として正しいものはどれか。',
            choices: [
              '短い開発サイクルを繰り返しながら開発する',
              '各工程を順番に一方向で進める',
              '要件変更に柔軟に対応できる',
              'テストを最初に書いてから実装する',
            ],
            answer: 1,
            explanation: 'ウォーターフォールモデルは要件定義→設計→実装→テストを順番に進め、原則として前の工程に戻りません。',
          },
        ],
      },
      {
        id: 'a7-2',
        title: 'テスト技法',
        content: `
<h3>テストの種類</h3>
<ul>
  <li><strong>単体テスト</strong>: 個々のモジュール（関数・クラス）を単独でテスト</li>
  <li><strong>結合テスト</strong>: 複数のモジュールを組み合わせてテスト</li>
  <li><strong>システムテスト</strong>: システム全体が要件を満たすかテスト</li>
  <li><strong>受入テスト</strong>: ユーザーが実際に使用して確認するテスト</li>
</ul>

<h3>ブラックボックステスト</h3>
<p>内部の処理を見ずに<strong>入力と出力</strong>だけで確認するテストです。</p>
<p>代表的な技法: <strong>同値分割</strong>（有効・無効な入力グループを代表値でテスト）、<strong>境界値分析</strong>（境界の値をテスト）</p>

<h3>ホワイトボックステスト</h3>
<p>プログラムの<strong>内部構造（ソースコード）</strong>を確認しながら行うテストです。</p>
<p>命令網羅・分岐網羅などのカバレッジ基準を使う。</p>
        `,
        diagram: 'testing',
        questions: [
          {
            id: 27,
            question: 'プログラムの内部構造を考慮せず、入力と出力だけを確認するテスト手法はどれか。',
            choices: ['ホワイトボックステスト', 'ブラックボックステスト', '回帰テスト', '単体テスト'],
            answer: 1,
            explanation: 'ブラックボックステストは内部実装を意識せず、仕様通りの入出力かどうかを確認するテスト手法です。',
          },
        ],
      },
    ],
  },
  {
    id: 'a8',
    title: 'マネジメント',
    subject: 'A',
    description: 'プロジェクト管理・品質管理・ITサービスマネジメントを学びます。',
    sections: [
      {
        id: 'a8-1',
        title: 'プロジェクトマネジメント',
        content: `
<h3>プロジェクトマネジメントとは</h3>
<p>決められた<strong>期間・コスト・品質</strong>の目標を達成するための管理手法です。</p>

<h3>WBS（Work Breakdown Structure）</h3>
<p>プロジェクトの作業を階層的に分解した図です。作業の漏れを防ぎ、工数見積もりに使います。</p>

<h3>ガントチャート</h3>
<p>各作業の開始・終了日程を横棒で表した図です。進捗管理に使われます。</p>

<h3>クリティカルパス</h3>
<p>プロジェクト完了までの<strong>最長経路</strong>です。この経路上の作業が遅れると全体が遅れます。</p>

<h3>PMBOK</h3>
<p>PMI（米国プロジェクトマネジメント協会）が定めたプロジェクト管理の知識体系です。5つのプロセス群（立上げ・計画・実行・監視コントロール・終結）と10の知識エリアで構成されます。</p>
        `,
        diagram: 'gantt',
        questions: [
          {
            id: 28,
            question: 'プロジェクトの作業を階層的に分解して整理したものを何というか。',
            choices: ['ガントチャート', 'WBS', 'クリティカルパス', 'PMBOK'],
            answer: 1,
            explanation: 'WBS（Work Breakdown Structure）はプロジェクトの作業を階層的に分解した図で、作業の漏れ防止と工数見積もりに使います。',
          },
          {
            id: 29,
            question: 'クリティカルパスの説明として正しいものはどれか。',
            choices: [
              'プロジェクトで最もコストがかかる経路',
              'プロジェクト完了までの最長経路',
              '品質上最も重要な作業の経路',
              '最初に完了できる最短経路',
            ],
            answer: 1,
            explanation: 'クリティカルパスはプロジェクト完了までの最長経路で、この経路の作業が遅れると全体のスケジュールが遅延します。',
          },
        ],
      },
      {
        id: 'a8-2',
        title: '品質管理とSLA',
        content: `
<h3>品質管理</h3>
<p>ソフトウェアの品質を管理するための指標や手法です。</p>

<h3>品質特性（ISO/IEC 25010）</h3>
<ul>
  <li><strong>機能適合性</strong>: 要求された機能を正しく提供しているか</li>
  <li><strong>性能効率性</strong>: 応答時間・処理速度が要件を満たしているか</li>
  <li><strong>使用性</strong>: ユーザーが使いやすいか</li>
  <li><strong>信頼性</strong>: 障害なく動作し続けられるか</li>
  <li><strong>保守性</strong>: 修正・変更しやすいか</li>
  <li><strong>移植性</strong>: 他の環境に移行できるか</li>
</ul>

<h3>SLA（サービスレベル合意書）</h3>
<p>サービス提供者とユーザーの間で、サービス品質の水準を定めた合意書です。</p>
<p>例: 「稼働率99.9%以上を保証する」「障害発生時は4時間以内に復旧する」</p>

<h3>稼働率の計算</h3>
<p>稼働率 = MTBF ÷ (MTBF + MTTR)</p>
<p><strong>MTBF</strong>（平均故障間隔）: 故障から次の故障までの平均時間</p>
<p><strong>MTTR</strong>（平均修復時間）: 故障してから復旧するまでの平均時間</p>
        `,
        diagram: 'reliability',
        questions: [
          {
            id: 30,
            question: 'MTBF=90時間、MTTR=10時間のとき、稼働率はいくつか。',
            choices: ['0.9', '0.99', '0.1', '9.0'],
            answer: 0,
            explanation: '稼働率 = MTBF ÷ (MTBF + MTTR) = 90 ÷ (90 + 10) = 90 ÷ 100 = 0.9 です。',
          },
        ],
      },
    ],
  },
  {
    id: 'a9',
    title: 'ストラテジ',
    subject: 'A',
    description: '経営戦略・法務・著作権・情報倫理など、ITと社会の関わりを学びます。',
    sections: [
      {
        id: 'a9-1',
        title: '経営戦略とIT',
        content: `
<h3>経営戦略フレームワーク</h3>
<p><strong>SWOT分析</strong>: 強み(Strengths)・弱み(Weaknesses)・機会(Opportunities)・脅威(Threats)を整理する手法。</p>
<p><strong>PPM（プロダクト・ポートフォリオ・マネジメント）</strong>: 市場成長率と市場占有率で事業を「花形」「金のなる木」「問題児」「負け犬」に分類。</p>

<h3>BPR・BPM</h3>
<p><strong>BPR（業務プロセス再設計）</strong>: ITを活用して業務プロセスを抜本的に見直す。</p>
<p><strong>BPM（業務プロセス管理）</strong>: 業務プロセスを継続的に改善・管理する。</p>

<h3>SoE・SoR</h3>
<p><strong>SoR（System of Record）</strong>: 基幹業務システム。正確性・安定性を重視。</p>
<p><strong>SoE（System of Engagement）</strong>: 顧客との関係構築システム。柔軟性・スピードを重視。</p>
        `,
        diagram: 'strategy',
        questions: [
          {
            id: 31,
            question: 'SWOT分析の「O」が表すものはどれか。',
            choices: ['強み', '弱み', '機会', '脅威'],
            answer: 2,
            explanation: 'SWOTのOはOpportunities（機会）を表します。外部環境における有利な状況のことです。',
          },
        ],
      },
      {
        id: 'a9-2',
        title: '法務・知的財産権',
        content: `
<h3>著作権</h3>
<p>創作物を作った時点で自動的に発生する権利です（登録不要）。</p>
<p>プログラムも著作物として保護されます。保護期間は著作者の死後<strong>70年</strong>。</p>

<h3>産業財産権</h3>
<ul>
  <li><strong>特許権</strong>: 発明（技術的アイデア）を保護。保護期間20年。出願が必要。</li>
  <li><strong>実用新案権</strong>: 考案（物の形状・構造）を保護。保護期間10年。</li>
  <li><strong>意匠権</strong>: デザイン（外観）を保護。保護期間25年。</li>
  <li><strong>商標権</strong>: ブランド名・ロゴを保護。保護期間10年（更新可）。</li>
</ul>

<h3>個人情報保護法</h3>
<p>生存する個人を識別できる情報（個人情報）の取り扱いを定めた法律です。</p>
<p>個人情報を取得する際は<strong>利用目的の明示</strong>が必要。第三者提供には原則として本人の同意が必要。</p>
        `,
        diagram: 'law',
        questions: [
          {
            id: 32,
            question: '特許権の保護期間として正しいものはどれか。',
            choices: ['5年', '10年', '20年', '70年'],
            answer: 2,
            explanation: '特許権の保護期間は出願日から20年です。著作権（死後70年）と混同しないよう注意しましょう。',
          },
          {
            id: 33,
            question: '著作権について正しいものはどれか。',
            choices: [
              '特許庁に登録しないと権利が発生しない',
              '創作した時点で自動的に権利が発生する',
              'プログラムは著作権の保護対象外である',
              '保護期間は著作者の死後30年である',
            ],
            answer: 1,
            explanation: '著作権は創作した時点で自動的に発生します（無方式主義）。プログラムも著作物として保護され、保護期間は死後70年です。',
          },
        ],
      },
    ],
  },
  {
    id: 'b3',
    title: '再帰・木・グラフ',
    subject: 'B',
    description: '再帰アルゴリズム・木構造・グラフの探索を擬似コードで学びます。',
    sections: [
      {
        id: 'b3-1',
        title: '再帰アルゴリズム',
        content: `
<h3>再帰とは</h3>
<p>関数が<strong>自分自身を呼び出す</strong>プログラミング技法です。分割して考えやすい問題に向いています。</p>

<h3>階乗の計算（再帰）</h3>
<pre>
関数 階乗(n):
    もし n = 0 または n = 1 なら:
        1 を返す  // 基底条件
    そうでなければ:
        n × 階乗(n - 1) を返す  // 再帰呼び出し

// 実行例
階乗(4)
= 4 × 階乗(3)
= 4 × 3 × 階乗(2)
= 4 × 3 × 2 × 階乗(1)
= 4 × 3 × 2 × 1
= 24
</pre>

<h3>フィボナッチ数列</h3>
<pre>
関数 フィボナッチ(n):
    もし n <= 1 なら:
        n を返す
    そうでなければ:
        フィボナッチ(n-1) + フィボナッチ(n-2) を返す

// F(0)=0, F(1)=1, F(2)=1, F(3)=2, F(4)=3, F(5)=5 ...
</pre>

<h3>再帰の注意点</h3>
<p>必ず<strong>基底条件</strong>（再帰を終了させる条件）を設けないと無限ループになります。</p>
        `,
        diagram: 'recursion',
        questions: [
          {
            id: 34,
            question: '再帰関数において無限ループを防ぐために必要なものはどれか。',
            choices: ['ループ変数', '基底条件', '配列', 'スタック'],
            answer: 1,
            explanation: '再帰関数には必ず基底条件（再帰呼び出しを終了させる条件）が必要です。これがないと無限に自分を呼び出し続けます。',
          },
          {
            id: 35,
            question: '階乗(3) の計算結果はどれか（上記の再帰関数を使用）。',
            choices: ['3', '6', '9', '12'],
            answer: 1,
            explanation: '3! = 3 × 2 × 1 = 6 です。',
          },
        ],
      },
      {
        id: 'b3-2',
        title: '木構造とグラフ探索',
        content: `
<h3>木（ツリー）構造</h3>
<p>階層的なデータを表すデータ構造です。</p>
<ul>
  <li><strong>根（ルート）</strong>: 最上位のノード</li>
  <li><strong>葉（リーフ）</strong>: 子を持たないノード</li>
  <li><strong>深さ</strong>: ルートからのノードの距離</li>
</ul>

<h3>二分探索木</h3>
<p>各ノードに対して、<strong>左の子 < 親 < 右の子</strong>の関係を保つ木です。</p>
<pre>
        8
       / \\
      3   10
     / \\    \\
    1   6    14
       / \\
      4   7
</pre>

<h3>木の探索（深さ優先）</h3>
<pre>
// 前順（プレオーダー）: 親→左→右
前順探索(ノード):
    もし ノードが空 なら 終了
    ノードの値を表示する
    前順探索(ノードの左の子)
    前順探索(ノードの右の子)

// 上の木の前順: 8, 3, 1, 6, 4, 7, 10, 14
</pre>

<h3>グラフの探索</h3>
<p><strong>BFS（幅優先探索）</strong>: キューを使って近いノードから順に探索。最短経路の発見に使う。</p>
<p><strong>DFS（深さ優先探索）</strong>: スタックを使って深く潜ってから戻る探索。</p>
        `,
        diagram: 'tree',
        questions: [
          {
            id: 36,
            question: '二分探索木において、あるノードの左の子の値はどれか。',
            choices: ['親ノードより大きい', '親ノードより小さい', '親ノードと等しい', '任意の値'],
            answer: 1,
            explanation: '二分探索木では「左の子 < 親 < 右の子」の規則があります。この性質により効率的な検索が可能です。',
          },
          {
            id: 37,
            question: '最短経路を求める際に適した探索アルゴリズムはどれか。',
            choices: ['DFS（深さ優先探索）', 'BFS（幅優先探索）', 'バブルソート', '二分探索'],
            answer: 1,
            explanation: 'BFS（幅優先探索）は近いノードから順に探索するため、重みなしグラフでの最短経路発見に適しています。',
          },
        ],
      },
    ],
  },
  {
    id: 'b4',
    title: 'オブジェクト指向',
    subject: 'B',
    description: 'クラス・継承・ポリモーフィズムなど、オブジェクト指向の概念を学びます。',
    sections: [
      {
        id: 'b4-1',
        title: 'クラスとオブジェクト',
        content: `
<h3>オブジェクト指向とは</h3>
<p>プログラムを<strong>オブジェクト（物）</strong>の集まりとして設計する考え方です。データ（属性）と処理（メソッド）をひとまとめにします。</p>

<h3>クラスとインスタンス</h3>
<p><strong>クラス</strong>: オブジェクトの設計図。共通の属性とメソッドを定義する。</p>
<p><strong>インスタンス</strong>: クラスを元に作られた具体的なオブジェクト。</p>
<pre>
クラス 動物:
    属性: 名前, 年齢
    メソッド 鳴く():
        表示する(名前 + "が鳴いた")

// インスタンスの生成
犬 ← 動物.新規作成()
犬.名前 ← "ポチ"
犬.鳴く()  // → "ポチが鳴いた"
</pre>

<h3>カプセル化</h3>
<p>オブジェクトの内部データを外部から直接変更できないよう隠蔽する仕組みです。<strong>アクセサ（getter/setter）</strong>を通じてデータにアクセスします。</p>
        `,
        diagram: 'oop',
        questions: [
          {
            id: 38,
            question: 'クラスを元に作られた具体的なオブジェクトを何というか。',
            choices: ['クラス', 'インスタンス', 'メソッド', '属性'],
            answer: 1,
            explanation: 'クラスは設計図、インスタンスはその設計図から作られた実体です。',
          },
        ],
      },
      {
        id: 'b4-2',
        title: '継承とポリモーフィズム',
        content: `
<h3>継承（インヘリタンス）</h3>
<p>既存のクラス（親クラス）の属性とメソッドを引き継いで、新しいクラス（子クラス）を作る仕組みです。コードの再利用性が高まります。</p>
<pre>
クラス 動物:
    メソッド 鳴く():
        表示する("...")

クラス 犬 は 動物 を継承:
    メソッド 鳴く():  // オーバーライド
        表示する("ワン！")

クラス 猫 は 動物 を継承:
    メソッド 鳴く():  // オーバーライド
        表示する("ニャー！")
</pre>

<h3>ポリモーフィズム（多態性）</h3>
<p>同じメソッド名でも、オブジェクトの種類によって<strong>異なる動作</strong>をする仕組みです。</p>
<pre>
動物リスト ← [犬.新規作成(), 猫.新規作成()]

動物リスト の 各動物 に対して:
    動物.鳴く()
// → "ワン！"
// → "ニャー！"
</pre>

<h3>UMLクラス図</h3>
<p>クラス間の関係を図で表現する標準的な記法です。</p>
<ul>
  <li><strong>汎化（継承）</strong>: 白抜き三角の矢印</li>
  <li><strong>集約</strong>: 白抜きひし形の矢印（部分は独立して存在可）</li>
  <li><strong>コンポジション</strong>: 塗りつぶしひし形（部分は独立して存在不可）</li>
</ul>
        `,
        diagram: 'inheritance',
        questions: [
          {
            id: 39,
            question: '同じメソッド名でもオブジェクトの種類によって異なる動作をする性質を何というか。',
            choices: ['カプセル化', '継承', 'ポリモーフィズム', '抽象化'],
            answer: 2,
            explanation: 'ポリモーフィズム（多態性）は、同じインタフェースで異なる型のオブジェクトを統一的に扱える性質です。',
          },
          {
            id: 40,
            question: '親クラスのメソッドを子クラスで再定義することを何というか。',
            choices: ['オーバーロード', 'オーバーライド', 'カプセル化', 'インスタンス化'],
            answer: 1,
            explanation: 'オーバーライドは親クラスのメソッドを子クラスで上書きして再定義することです。オーバーロードは同名で引数が異なるメソッドを複数定義することです。',
          },
        ],
      },
    ],
  },
];

export const curriculum: Chapter[] = [...baseChapters, ...additionalChapters];

export const getChapterById = (id: string) => curriculum.find(c => c.id === id);
export const getSubjectChapters = (subject: 'A' | 'B') => curriculum.filter(c => c.subject === subject);
