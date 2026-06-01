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
