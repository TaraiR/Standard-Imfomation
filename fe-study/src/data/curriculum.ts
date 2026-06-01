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

export const curriculum: Chapter[] = [
  {
    id: 'a1',
    title: '基礎理論',
    subject: 'A',
    description: '2進数・16進数、論理演算、情報量など、ITの土台となる数学的基礎を学びます。',
    sections: [
      {
        id: 'a1-1',
        title: '2進数と16進数',
        content: `
<h3>なぜ2進数を使うのか</h3>
<p>コンピュータは電気回路で動いています。電気のON/OFFという2つの状態だけで数を表すのが<strong>2進数</strong>です。</p>

<h3>基数変換</h3>
<p>10進数の <code>13</code> を2進数に変換してみましょう。</p>
<ul>
  <li>13 ÷ 2 = 6 … 余り <strong>1</strong></li>
  <li>6 ÷ 2 = 3 … 余り <strong>0</strong></li>
  <li>3 ÷ 2 = 1 … 余り <strong>1</strong></li>
  <li>1 ÷ 2 = 0 … 余り <strong>1</strong></li>
</ul>
<p>余りを下から読むと → <code>1101</code>(2)</p>

<h3>16進数</h3>
<p>2進数4桁 = 16進数1桁です。0〜9とA〜Fの16種類の文字を使います。</p>
<p>例: <code>1101 1010</code>(2) = <code>DA</code>(16)</p>
        `,
        diagram: 'binary',
        questions: [
          {
            id: 1,
            question: '10進数の 26 を2進数に変換したものはどれか。',
            choices: ['10110', '11010', '11001', '10011'],
            answer: 1,
            explanation: '26 = 16+8+2 = 2^4 + 2^3 + 2^1 なので 11010 です。',
          },
          {
            id: 2,
            question: '16進数の FF を10進数に変換したものはどれか。',
            choices: ['240', '255', '256', '128'],
            answer: 1,
            explanation: 'F=15 なので、15×16 + 15 = 240 + 15 = 255 です。',
          },
        ],
      },
      {
        id: 'a1-2',
        title: '論理演算',
        content: `
<h3>論理演算とは</h3>
<p>真(1)・偽(0)の値を操作する演算です。基本の3つを覚えましょう。</p>

<h3>AND（論理積）</h3>
<p>両方が1のときだけ1になります。「かつ」の意味です。</p>

<h3>OR（論理和）</h3>
<p>どちらか一方が1なら1になります。「または」の意味です。</p>

<h3>NOT（否定）</h3>
<p>0と1を反転させます。</p>

<h3>XOR（排他的論理和）</h3>
<p>どちらか<strong>一方だけ</strong>が1のとき1になります。同じ値なら0です。</p>
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
        ],
      },
    ],
  },
  {
    id: 'a2',
    title: 'コンピュータの構成',
    subject: 'A',
    description: 'CPU・メモリ・入出力装置など、コンピュータを構成する5大装置を学びます。',
    sections: [
      {
        id: 'a2-1',
        title: '5大装置',
        content: `
<h3>コンピュータの5大装置</h3>
<p>コンピュータは以下の5つの装置で構成されています。</p>
<ul>
  <li><strong>制御装置</strong>: プログラムを解読し、各装置に指示を出す「司令塔」</li>
  <li><strong>演算装置（ALU）</strong>: 四則演算・論理演算を実行する</li>
  <li><strong>記憶装置</strong>: データやプログラムを保存する（主記憶・補助記憶）</li>
  <li><strong>入力装置</strong>: データを取り込む（キーボード・マウスなど）</li>
  <li><strong>出力装置</strong>: 結果を出力する（ディスプレイ・プリンタなど）</li>
</ul>
<p>制御装置と演算装置を合わせたものが <strong>CPU（中央処理装置）</strong> です。</p>

<h3>主記憶と補助記憶</h3>
<p><strong>主記憶（RAM）</strong>: 高速だが電源を切るとデータが消える揮発性メモリ。</p>
<p><strong>補助記憶（HDD/SSD）</strong>: 低速だが電源を切ってもデータが残る不揮発性メモリ。</p>
        `,
        diagram: 'cpu',
        questions: [
          {
            id: 5,
            question: 'CPUに含まれる装置の組み合わせとして正しいものはどれか。',
            choices: [
              '制御装置と演算装置',
              '制御装置と記憶装置',
              '演算装置と入力装置',
              '記憶装置と出力装置',
            ],
            answer: 0,
            explanation: 'CPUは制御装置（命令解読）と演算装置（ALU）を合わせたものです。',
          },
          {
            id: 6,
            question: '電源を切るとデータが消える記憶装置はどれか。',
            choices: ['HDD', 'SSD', 'RAM', 'ROM'],
            answer: 2,
            explanation: 'RAM（主記憶）は揮発性メモリで、電源オフでデータが消えます。',
          },
        ],
      },
      {
        id: 'a2-2',
        title: 'CPUの性能指標',
        content: `
<h3>クロック周波数</h3>
<p>CPUが1秒間に処理できるサイクル数です。単位は <strong>Hz（ヘルツ）</strong>。3GHzなら1秒に30億回処理できます。</p>

<h3>MIPS</h3>
<p>1秒間に実行できる命令数を百万単位で表したものです（Million Instructions Per Second）。</p>
<p>例: 1000MIPSのCPUは1秒に10億命令を処理できます。</p>

<h3>CPI（Cycles Per Instruction）</h3>
<p>1命令あたりに必要なクロック数です。CPIが小さいほど効率が良いです。</p>
<p>実行時間 = 命令数 × CPI ÷ クロック周波数</p>
        `,
        diagram: 'clock',
        questions: [
          {
            id: 7,
            question: 'クロック周波数が 2GHz、CPI が 4 のとき、MIPSはいくつか。',
            choices: ['500', '250', '8000', '2000'],
            answer: 0,
            explanation: 'MIPS = クロック周波数 ÷ CPI = 2000MHz ÷ 4 = 500MIPS です。',
          },
        ],
      },
    ],
  },
  {
    id: 'a3',
    title: 'ネットワーク',
    subject: 'A',
    description: 'TCP/IP・IPアドレス・プロトコルなど、ネットワークの基本を学びます。',
    sections: [
      {
        id: 'a3-1',
        title: 'TCP/IPとOSI参照モデル',
        content: `
<h3>OSI参照モデル（7層）</h3>
<p>ネットワークの機能を7つの層（レイヤー）に分けたモデルです。</p>
<ol>
  <li><strong>物理層</strong>: ビットの電気信号変換</li>
  <li><strong>データリンク層</strong>: 同一ネットワーク内の通信（MACアドレス）</li>
  <li><strong>ネットワーク層</strong>: 異なるネットワーク間の通信（IPアドレス）</li>
  <li><strong>トランスポート層</strong>: 信頼性のある通信（TCP/UDP）</li>
  <li><strong>セッション層</strong>: 通信セッションの管理</li>
  <li><strong>プレゼンテーション層</strong>: データの形式変換・暗号化</li>
  <li><strong>アプリケーション層</strong>: アプリが使うプロトコル（HTTP, FTP, DNS）</li>
</ol>

<h3>TCPとUDPの違い</h3>
<p><strong>TCP</strong>: 信頼性が高い。受信確認あり。遅い。Webやメールに使用。</p>
<p><strong>UDP</strong>: 信頼性が低い。受信確認なし。速い。動画配信やVoIPに使用。</p>
        `,
        diagram: 'osi',
        questions: [
          {
            id: 8,
            question: 'IPアドレスを扱う層はOSI参照モデルの第何層か。',
            choices: ['第2層（データリンク層）', '第3層（ネットワーク層）', '第4層（トランスポート層）', '第7層（アプリケーション層）'],
            answer: 1,
            explanation: 'IPアドレスはネットワーク層（第3層）で扱われます。',
          },
          {
            id: 9,
            question: '動画ストリーミングに適したプロトコルはどれか。',
            choices: ['TCP', 'UDP', 'HTTP', 'FTP'],
            answer: 1,
            explanation: 'UDPは受信確認がなく高速なため、多少のパケットロスを許容できる動画配信に適しています。',
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

export const getChapterById = (id: string) => curriculum.find(c => c.id === id);
export const getSubjectChapters = (subject: 'A' | 'B') => curriculum.filter(c => c.subject === subject);
