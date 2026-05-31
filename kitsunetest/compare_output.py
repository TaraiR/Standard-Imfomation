"""
Python (AfterImage.py) vs C++ (test_feature_extractor.exe) の出力比較スクリプト
- scapy / pyximport / Cython 不要
- TSV ファイルを直接読み込む
"""
import sys
import math
import csv
import subprocess
import os

# ---- AfterImage (pure Python, pyximport なし) ----

class incStat:
    def __init__(self, Lambda, ID, init_time=0, isTypeDiff=False):
        self.ID = ID
        self.CF1 = 0
        self.CF2 = 0
        self.w = 1e-20
        self.isTypeDiff = isTypeDiff
        self.Lambda = Lambda
        self.lastTimestamp = init_time
        self.cur_mean = float('nan')
        self.cur_var  = float('nan')
        self.cur_std  = float('nan')
        self.covs = []

    def insert(self, v, t=0):
        if self.isTypeDiff:
            dif = t - self.lastTimestamp
            v = dif if dif > 0 else 0
        self.processDecay(t)
        self.CF1 += v
        self.CF2 += v * v
        self.w   += 1
        self.cur_mean = float('nan')
        self.cur_var  = float('nan')
        self.cur_std  = float('nan')
        for cov in self.covs:
            cov.update_cov(self.ID, v, t)

    def processDecay(self, timestamp):
        timeDiff = timestamp - self.lastTimestamp
        if timeDiff > 0:
            factor = math.pow(2, -self.Lambda * timeDiff)
            self.CF1 *= factor
            self.CF2 *= factor
            self.w   *= factor
            self.lastTimestamp = timestamp
        return 1

    def mean(self):
        if math.isnan(self.cur_mean):
            self.cur_mean = self.CF1 / self.w
        return self.cur_mean

    def var(self):
        if math.isnan(self.cur_var):
            self.cur_var = abs(self.CF2 / self.w - self.mean() ** 2)
        return self.cur_var

    def std(self):
        if math.isnan(self.cur_std):
            self.cur_std = math.sqrt(self.var())
        return self.cur_std

    def radius(self, other_incStats):
        A = self.var() ** 2
        for s in other_incStats:
            A += s.var() ** 2
        return math.sqrt(A)

    def magnitude(self, other_incStats):
        A = self.mean() ** 2
        for s in other_incStats:
            A += s.mean() ** 2
        return math.sqrt(A)

    def allstats_1D(self):
        self.cur_mean = self.CF1 / self.w
        self.cur_var  = abs(self.CF2 / self.w - self.cur_mean ** 2)
        return [self.w, self.cur_mean, self.cur_var]


class incStat_cov:
    def __init__(self, incS1, incS2, init_time=0):
        self.incStats = [incS1, incS2]
        self.lastRes  = [0, 0]
        self.CF3 = 0
        self.w3  = 1e-20
        self.lastTimestamp_cf3 = init_time

    def update_cov(self, ID, v, t):
        if   ID == self.incStats[0].ID: inc = 0
        elif ID == self.incStats[1].ID: inc = 1
        else: return

        self.incStats[not inc].processDecay(t)
        self.processDecay(t, inc)

        res   = v - self.incStats[inc].mean()
        resid = res * self.lastRes[not inc]
        self.CF3 += resid
        self.w3  += 1
        self.lastRes[inc] = res

    def processDecay(self, t, micro_inc_indx):
        timeDiff = t - self.lastTimestamp_cf3
        if timeDiff > 0:
            factor = math.pow(2, -self.incStats[micro_inc_indx].Lambda * timeDiff)
            self.CF3 *= factor
            self.w3  *= factor
            self.lastTimestamp_cf3 = t
            self.lastRes[micro_inc_indx] *= factor

    def cov(self):
        return self.CF3 / self.w3

    def pcc(self):
        ss = self.incStats[0].std() * self.incStats[1].std()
        return self.cov() / ss if ss != 0 else 0

    def get_stats2(self):
        return [
            self.incStats[0].radius([self.incStats[1]]),
            self.incStats[0].magnitude([self.incStats[1]]),
            self.cov(),
            self.pcc()
        ]


class incStatDB:
    def __init__(self, limit=float('inf')):
        self.HT = {}
        self.limit = limit

    def register(self, ID, Lambda, init_time=0, isTypeDiff=False):
        key = ID + "_" + str(Lambda)
        if key not in self.HT:
            self.HT[key] = incStat(Lambda, ID, init_time, isTypeDiff)
        return self.HT[key]

    def register_cov(self, ID1, ID2, Lambda, init_time=0):
        incS1 = self.register(ID1, Lambda, init_time)
        incS2 = self.register(ID2, Lambda, init_time)
        for cov in incS1.covs:
            if cov.incStats[0].ID == ID2 or cov.incStats[1].ID == ID2:
                return cov
        cov = incStat_cov(incS1, incS2, init_time)
        incS1.covs.append(cov)
        incS2.covs.append(cov)
        return cov

    def update_get_1D_Stats(self, ID, t, v, Lambda, isTypeDiff=False):
        s = self.register(ID, Lambda, t, isTypeDiff)
        s.insert(v, t)
        return s.allstats_1D()

    def update_get_1D2D_Stats(self, ID1, ID2, t, v, Lambda):
        stats1D = self.update_get_1D_Stats(ID1, t, v, Lambda)
        cov = self.register_cov(ID1, ID2, Lambda, t)
        cov.update_cov(ID1, v, t)
        return stats1D + cov.get_stats2()


# ---- netStat (Python) ----

class netStat:
    def __init__(self, Lambdas=None, HostLimit=255, HostSimplexLimit=1000):
        self.Lambdas = Lambdas if Lambdas else [5, 3, 1, 0.1, 0.01]
        self.HostLimit    = HostLimit
        self.SessionLimit = HostSimplexLimit * HostLimit * HostLimit
        self.MAC_HostLimit = HostLimit * 10
        self.HT_jit = incStatDB(limit=HostLimit * HostLimit)
        self.HT_MI  = incStatDB(limit=self.MAC_HostLimit)
        self.HT_H   = incStatDB(limit=HostLimit)
        self.HT_Hp  = incStatDB(limit=self.SessionLimit)

    def updateGetStats(self, IPtype, srcMAC, dstMAC, srcIP, srcProtocol,
                       dstIP, dstProtocol, datagramSize, timestamp):
        MIstat     = [0.0] * (3 * len(self.Lambdas))
        HHstat     = [0.0] * (7 * len(self.Lambdas))
        HHstat_jit = [0.0] * (3 * len(self.Lambdas))
        HpHpstat   = [0.0] * (7 * len(self.Lambdas))

        for i, lam in enumerate(self.Lambdas):
            s = self.HT_MI.update_get_1D_Stats(srcMAC + srcIP, timestamp, datagramSize, lam)
            MIstat[i*3:(i+1)*3] = s

        for i, lam in enumerate(self.Lambdas):
            s = self.HT_H.update_get_1D2D_Stats(srcIP, dstIP, timestamp, datagramSize, lam)
            HHstat[i*7:(i+1)*7] = s

        for i, lam in enumerate(self.Lambdas):
            s = self.HT_jit.update_get_1D_Stats(srcIP + dstIP, timestamp, 0, lam, isTypeDiff=True)
            HHstat_jit[i*3:(i+1)*3] = s

        if srcProtocol == 'arp':
            for i, lam in enumerate(self.Lambdas):
                s = self.HT_Hp.update_get_1D2D_Stats(srcMAC, dstMAC, timestamp, datagramSize, lam)
                HpHpstat[i*7:(i+1)*7] = s
        else:
            for i, lam in enumerate(self.Lambdas):
                s = self.HT_Hp.update_get_1D2D_Stats(
                    srcIP + srcProtocol, dstIP + dstProtocol, timestamp, datagramSize, lam)
                HpHpstat[i*7:(i+1)*7] = s

        return MIstat + HHstat + HHstat_jit + HpHpstat


# ---- TSV パーサ (Python) ----

def parse_tsv(tsv_path, max_packets):
    nstat = netStat()
    results = []
    with open(tsv_path, 'rt', encoding='utf-8') as f:
        reader = csv.reader(f, delimiter='\t')
        next(reader)  # header skip
        for i, row in enumerate(reader):
            if i >= max_packets:
                break
            timestamp = float(row[0])
            framelen  = float(row[1])
            srcMAC = row[2]
            dstMAC = row[3]
            srcIP  = row[4]
            dstIP  = row[5]
            srcproto = row[6] + row[8]
            dstproto = row[7] + row[9]
            IPtype = -1
            if row[4] != '':
                IPtype = 0
            elif row[17] != '':
                srcIP = row[17]
                dstIP = row[18]
                IPtype = 1

            if srcproto == '':
                if row[12] != '':   # ARP
                    srcproto = 'arp'
                    dstproto = 'arp'
                    srcIP    = row[14]
                    dstIP    = row[16]
                    IPtype   = 0
                elif row[10] != '': # ICMP
                    srcproto = 'icmp'
                    dstproto = 'icmp'
                    IPtype   = 0
                elif srcIP + srcproto + dstIP + dstproto == '':
                    srcIP = row[2]
                    dstIP = row[3]

            vec = nstat.updateGetStats(IPtype, srcMAC, dstMAC, srcIP, srcproto,
                                       dstIP, dstproto, int(framelen), timestamp)
            results.append(vec)
    return results


# ---- C++ 実行 ----

def run_cpp(exe_path, n_packets):
    # CWD をexeのディレクトリに設定してからpathで実行
    cwd = os.path.dirname(exe_path)
    result = subprocess.run([exe_path], capture_output=True, text=True, cwd=os.path.dirname(exe_path) + "/..")
    lines = result.stdout.strip().split('\n')
    vectors = []
    for line in lines:
        if line.startswith("Features:"):
            vals = list(map(float, line[len("Features:"):].split()))
            vectors.append(vals)
    return vectors


# ---- 比較 ----

def compare(py_vecs, cpp_vecs, tol=1e-6):
    n = min(len(py_vecs), len(cpp_vecs))
    print(f"比較パケット数: {n}  (Python:{len(py_vecs)}, C++:{len(cpp_vecs)})")
    print(f"特徴量次元: Python={len(py_vecs[0]) if py_vecs else '?'}, C++={len(cpp_vecs[0]) if cpp_vecs else '?'}")
    print("-" * 70)

    all_ok = True
    for i in range(n):
        pv = py_vecs[i]
        cv = cpp_vecs[i]
        if len(pv) != len(cv):
            print(f"Packet {i+1}: 次元数不一致 py={len(pv)} cpp={len(cv)}")
            all_ok = False
            continue

        mismatches = []
        for j, (p, c) in enumerate(zip(pv, cv)):
            if abs(p - c) > tol * max(1.0, abs(p)):
                mismatches.append((j, p, c))

        if mismatches:
            all_ok = False
            print(f"Packet {i+1}: {len(mismatches)} 要素が不一致")
            for j, p, c in mismatches[:5]:  # 最大5件表示
                print(f"  feature[{j:3d}]  py={p:.10g}  cpp={c:.10g}  diff={abs(p-c):.3e}")
            if len(mismatches) > 5:
                print(f"  ... 他 {len(mismatches)-5} 件")
        else:
            print(f"Packet {i+1}: OK")

    print("-" * 70)
    print("結果:", "全一致 OK" if all_ok else "不一致あり NG")


if __name__ == "__main__":
    base  = os.path.dirname(os.path.abspath(__file__))
    tsv   = os.path.join(base, "mirai_pcap", "mirai.pcap.tsv")
    exe   = os.path.join(base, "build", "test_feature_extractor.exe")
    N     = 10

    print("=== Python 実行 ===")
    py_vecs = parse_tsv(tsv, N)
    print(f"{len(py_vecs)} パケット処理完了")

    print("\n=== C++ 実行 ===")
    cpp_vecs = run_cpp(exe, N)
    print(f"{len(cpp_vecs)} パケット処理完了")

    print("\n=== 比較結果 ===")
    compare(py_vecs, cpp_vecs)
