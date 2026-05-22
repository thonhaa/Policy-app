import { useState } from "react";
import { Trash2 } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

// ── Design tokens (Brandwatch / Sprinklr style) ──────────────────────────────
const T = {
  bg:        "#F3F6F8",
  surface:   "#FFFFFF",
  border:    "#E5E7EB",
  borderLight: "#F3F4F6",
  text:      "#111827",
  textSub:   "#6B7280",
  textMeta:  "#9CA3AF",
  accent:    "#2563EB",
  sidebarBtn: "#0284C7",
  sidebarBtnBorder: "#0EA5E9",

  success: "#2F855A",
  successHover: "#276749",

  inputBg: "#F3F4F6",
  inputPlaceholder: "#6B7280",
  // Semantic – only 4, used ONLY for data encoding
  CONSTRUCTIVE: "#16A34A",
  COMPLAINT:    "#D97706",
  HOSTILE:      "#DC2626",
  IRRELEVANT:   "#9CA3AF",
};

const LABEL_VI = {
  CONSTRUCTIVE: "Xây dựng",
  COMPLAINT:    "Phàn nàn",
  HOSTILE:      "Công kích",
  IRRELEVANT:   "Không liên quan",
};

// ── Mock data ─────────────────────────────────────────────────────────────────
const POLICIES = [
  {
    id: 1,
    name: "Nghị định 168/2024",
    subtitle: "Xử phạt vi phạm giao thông đường bộ",
    date: "01/01/2025",
    total: 18420,
    dist: { CONSTRUCTIVE: 22, COMPLAINT: 48, HOSTILE: 19, IRRELEVANT: 11 },
    sources: 3,
    trend: [
      { day: "02/01", C: 18, P: 51, H: 22 },
      { day: "03/01", C: 20, P: 49, H: 25 },
      { day: "04/01", C: 19, P: 52, H: 28 },
      { day: "05/01", C: 23, P: 46, H: 20 },
      { day: "06/01", C: 25, P: 44, H: 17 },
      { day: "07/01", C: 24, P: 47, H: 16 },
      { day: "08/01", C: 22, P: 48, H: 19 },
    ],
    comments: [
      { id:1, text:"Phạt 18 triệu vượt đèn đỏ là quá nặng, thu nhập người lao động bình thường làm cả tháng chưa đủ.", label:"COMPLAINT", conf:0.94, author:"Nguyễn Văn An", channel:"VTV24", title:"Nghị định 168 chính thức có hiệu lực", time:"02/01/2025 08:14", link:"https://youtube.com/watch?v=JzU1EmcuFRU" },
      { id:2, text:"Nên cho người dân thời gian chuyển tiếp 6 tháng trước khi áp dụng, nhiều người chưa nắm được.", label:"CONSTRUCTIVE", conf:0.91, author:"Trần Minh Khoa", channel:"VTV24", title:"Nghị định 168 chính thức có hiệu lực", time:"02/01/2025 09:02", link:"https://youtube.com/watch?v=JzU1EmcuFRU" },
      { id:3, text:"CSGT đứng chỗ khuất để chặt chém dân chứ có lo an toàn giao thông đâu.", label:"HOSTILE", conf:0.92, author:"Phạm Đức Hùng", channel:"Tuổi Trẻ Online", title:"Phạt nguội bằng camera AI", time:"03/01/2025 11:05", link:"https://youtube.com/watch?v=NEGQKTWZTcc" },
      { id:4, text:"Cần đầu tư thêm hạ tầng hệ thống đèn tín hiệu trước rồi mới tính phạt.", label:"CONSTRUCTIVE", conf:0.88, author:"Lê Thu Hà", channel:"Tuổi Trẻ Online", title:"Phạt nguội bằng camera AI", time:"03/01/2025 10:30", link:"https://youtube.com/watch?v=NEGQKTWZTcc" },
      { id:5, text:"Video này giải thích rõ ràng lắm, cảm ơn kênh đã đăng tải!", label:"IRRELEVANT", conf:0.85, author:"Vũ Thị Lan", channel:"Pháp Luật TP.HCM", title:"Luật sư giải thích NĐ168", time:"04/01/2025 14:20", link:"https://youtube.com/watch?v=UHGXDHobrsY" },
      { id:6, text:"Nên có hệ thống camera tự động phạt nguội, vừa minh bạch vừa tránh tiêu cực.", label:"CONSTRUCTIVE", conf:0.89, author:"Bùi Quốc Toàn", channel:"VTV24", title:"Nghị định 168 chính thức có hiệu lực", time:"05/01/2025 08:55", link:"https://youtube.com/watch?v=JzU1EmcuFRU" },
    ],
    sources_list: [
      { id:"s1", channel:"VTV24", title:"Nghị định 168 chính thức có hiệu lực từ 1/1/2025", url:"https://youtube.com/watch?v=JzU1EmcuFRU", comments:8240, date:"01/01/2025" },
      { id:"s2", channel:"Báo Tuổi Trẻ Online", title:"Phạt nguội bằng camera AI – người dân nói gì?", url:"https://youtube.com/watch?v=NEGQKTWZTcc", comments:5100, date:"02/01/2025" },
      { id:"s3", channel:"Pháp Luật TP.HCM", title:"Luật sư giải thích NĐ168 – những điều cần biết", url:"https://youtube.com/watch?v=UHGXDHobrsY", comments:5080, date:"03/01/2025" },
    ],
  },
  {
    id: 2,
    name: "Luật Đất đai 2024",
    subtitle: "Bồi thường giải phóng mặt bằng",
    date: "01/08/2024",
    total: 9870,
    dist: { CONSTRUCTIVE: 31, COMPLAINT: 39, HOSTILE: 12, IRRELEVANT: 18 },
    sources: 1,
    trend: [
      { day: "02/08", C: 28, P: 42, H: 14 },
      { day: "03/08", C: 30, P: 40, H: 13 },
      { day: "04/08", C: 33, P: 38, H: 11 },
      { day: "05/08", C: 31, P: 39, H: 12 },
      { day: "06/08", C: 32, P: 37, H: 10 },
      { day: "07/08", C: 31, P: 40, H: 12 },
      { day: "08/08", C: 31, P: 39, H: 12 },
    ],
    comments: [
      { id:7, text:"Giá đền bù thấp hơn giá thị trường 3–4 lần, người dân bị thiệt đơn thiệt kép.", label:"COMPLAINT", conf:0.93, author:"Ngô Thị Mai", channel:"Quốc Hội TV", title:"Luật Đất đai 2024 – Những điểm mới", time:"02/08/2024 09:10", link:"https://youtube.com/watch?v=abc111" },
      { id:8, text:"Nên có hội đồng định giá độc lập gồm chuyên gia và đại diện người dân.", label:"CONSTRUCTIVE", conf:0.87, author:"Đinh Công Minh", channel:"Quốc Hội TV", title:"Luật Đất đai 2024 – Những điểm mới", time:"03/08/2024 11:30", link:"https://youtube.com/watch?v=abc111" },
    ],
    sources_list: [
      { id:"s4", channel:"Quốc Hội TV", title:"Luật Đất đai 2024 – Những điểm mới về bồi thường", url:"https://youtube.com/watch?v=abc111", comments:9870, date:"01/08/2024" },
    ],
  },
];

// ── Tiny helpers ──────────────────────────────────────────────────────────────
const fmt = n => n?.toLocaleString("vi-VN") ?? "—";

function LabelPill({ label }) {
  const map = {
    CONSTRUCTIVE: { bg:"#DCFCE7", color:"#15803D" },
    COMPLAINT:    { bg:"#FEF9C3", color:"#A16207" },
    HOSTILE:      { bg:"#FEE2E2", color:"#B91C1C" },
    IRRELEVANT:   { bg:"#F3F4F6", color:"#6B7280" },
  };
  const s = map[label] || map.IRRELEVANT;
  return (
    <span style={{ background:s.bg, color:s.color, borderRadius:4,
      padding:"2px 8px", fontSize:11, fontWeight:600, whiteSpace:"nowrap" }}>
      {LABEL_VI[label]}
    </span>
  );
}

function ConfBar({ val }) {
  const pct = Math.round(val * 100);
  const color = val >= 0.9 ? T.CONSTRUCTIVE : val >= 0.8 ? T.COMPLAINT : T.HOSTILE;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
      <div style={{ flex:1, height:4, background:T.borderLight, borderRadius:2 }}>
        <div style={{ width:`${pct}%`, height:4, background:color, borderRadius:2 }} />
      </div>
      <span style={{ fontSize:11, color:T.textSub, minWidth:28 }}>{pct}%</span>
    </div>
  );
}

// ── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ label, pct, count, colorKey, active, onClick }) {
  const color = T[colorKey];
  return (
    <div onClick={onClick} style={{
      background: T.surface, border:`1px solid ${active ? color : T.border}`,
      borderRadius:10, padding:"18px 20px", cursor:"pointer",
      borderTop: `3px solid ${color}`,
      boxShadow: active ? `0 0 0 3px ${color}22` : "none",
      transition:"all 0.15s",
    }}>
      <div style={{ fontSize:11, fontWeight:700, color:T.text,
        textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>
        {LABEL_VI[colorKey]}
      </div>
      <div style={{ fontSize:30, fontWeight:800, color, lineHeight:1 }}>{pct}%</div>
      <div style={{ fontSize:12, color:T.textSub, marginTop:4 }}>{fmt(count)} bình luận</div>
    </div>
  );
}

// ── Section card wrapper ──────────────────────────────────────────────────────
function Panel({ children, style }) {
  return (
    <div style={{ background:T.surface, border:`1px solid ${T.border}`,
      borderRadius:10, padding:"20px 22px", ...style }}>
      {children}
    </div>
  );
}

function PanelTitle({ children }) {
  return (
    <div style={{ fontSize:13, fontWeight:700, color:T.text, marginBottom:16 }}>
      {children}
    </div>
  );
}

// ── Donut chart (custom) ──────────────────────────────────────────────────────
function DonutChart({ dist, total }) {
  const entries = Object.entries(dist).filter(([,v]) => v > 0);

  const data = entries.map(([k,v]) => ({
    name: LABEL_VI[k],
    value: v,
    key: k
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={90}

          paddingAngle={1}
          dataKey="value"
          stroke="none"

          label={({ percent, x, y, midAngle, outerRadius, cx, cy }) => {
            const RADIAN = Math.PI / 180;
            const radius = outerRadius * 0.7;

            const px =
              cx + radius * Math.cos(-midAngle * RADIAN);

            const py =
              cy + radius * Math.sin(-midAngle * RADIAN);

            return (
              <text
                x={px}
                y={py}
                fill="#fff"
                textAnchor="middle"
                dominantBaseline="central"
                style={{
                  fontSize:14,
                  fontWeight:700
                }}
              >
                {`${(percent * 100).toFixed(0)}%`}
              </text>
            );
          }}

          labelLine={false}
        >
          {data.map((e, i) => (
            <Cell key={i} fill={T[e.key]} />
          ))}
        </Pie>

        <Tooltip
          formatter={v => `${v}%`}
          contentStyle={{
            borderRadius:8,
            border:`1px solid ${T.border}`,
            fontSize:12,
            padding:"6px 12px"
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ── Trend area chart ──────────────────────────────────────────────────────────
function TrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top:5, right:10, bottom:0, left:-10 }}>
        <defs>
          {[["C",T.CONSTRUCTIVE],["P",T.COMPLAINT],["H",T.HOSTILE]].map(([k,c])=>(
            <linearGradient key={k} id={`grad${k}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={c} stopOpacity={0.15}/>
              <stop offset="95%" stopColor={c} stopOpacity={0}/>
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} vertical={false} />
        <XAxis dataKey="day" tick={{ fontSize:11, fill:T.textMeta }}
          axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize:11, fill:T.textMeta }}
          axisLine={false} tickLine={false} unit="%" domain={[0,60]} />
        <Tooltip formatter={v=>`${v}%`}
          contentStyle={{ borderRadius:8, border:`1px solid ${T.border}`, fontSize:12 }}/>
        {[["C",T.CONSTRUCTIVE,"Xây dựng"],
          ["P",T.COMPLAINT,"Phàn nàn"],
          ["H",T.HOSTILE,"Công kích"]].map(([k,c,name])=>(
          <Area key={k} type="monotone" dataKey={k} name={name}
            stroke={c} strokeWidth={2}
            fill={`url(#grad${k})`} dot={false} activeDot={{ r:4 }} />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── Horizontal stacked bar compare ───────────────────────────────────────────
function CompareBar({ policies }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {policies.map(p=>{
        const total = Object.values(p.dist).reduce((a,b)=>a+b,0);
        return (
          <div key={p.id}>
            <div style={{ display:"flex", justifyContent:"space-between",
              fontSize:12, color:T.textSub, marginBottom:6 }}>
              <span style={{ fontWeight:600, color:T.text }}>{p.name}</span>
              <span>{fmt(p.total)} bình luận</span>
            </div>
            <div style={{ display:"flex", height:10, borderRadius:5, overflow:"hidden", gap:1 }}>
              {Object.entries(p.dist).map(([k,v])=>(
                <div key={k} style={{ flex:v, background:T[k] }}
                  title={`${LABEL_VI[k]}: ${v}%`} />
              ))}
            </div>
            <div style={{ display:"flex", gap:12, marginTop:5 }}>
              {Object.entries(p.dist).map(([k,v])=>(
                <span key={k} style={{ fontSize:10, color:T[k], fontWeight:600 }}>
                  {LABEL_VI[k]} {v}%
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Source manager tab ────────────────────────────────────────────────────────
function SourceTab({ policy }) {
  const [url, setUrl] = useState("");
  const [added, setAdded] = useState(false);

  // local state để xóa được
  const [sources, setSources] = useState(policy.sources_list);

  const handleAdd = () => {
    if (!url.includes("youtube.com")) return;

    // mock source mới
    const newSource = {
      id: Date.now().toString(),
      channel: "Nguồn mới",
      title: "Video mới được thêm",
      url,
      comments: 0,
      date: new Date().toLocaleDateString("vi-VN"),
    };

    setSources(prev => [newSource, ...prev]);

    setUrl("");
    setAdded(true);

    setTimeout(() => setAdded(false), 2000);
  };

  const handleDelete = (id) => {
    setSources(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <Panel>
        <PanelTitle>Thêm nguồn YouTube</PanelTitle>

        <div style={{
          fontSize:12,
          color:T.textSub,
          marginBottom:14,
          lineHeight:1.7
        }}>
          Nhập URL video YouTube chứa bình luận về chính sách. Hệ thống sẽ crawl và
          tự động phân loại bằng model <strong>Qwen3-4B fine-tuned</strong>.
          <br/>

          <span style={{
            color:T.CONSTRUCTIVE,
            fontWeight:600
          }}>
            Curated Source Analysis
          </span>{" "}
          — analyst xác thực nguồn trước khi đưa vào corpus.
        </div>

        <div style={{ display:"flex", gap:8 }}>
          <input
            value={url}
            onChange={e=>setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            onKeyDown={e=>e.key==="Enter"&&handleAdd()}
            style={{
              flex:1,
              padding:"10px 14px",
              borderRadius:8,
              border:`1px solid ${T.border}`,
              background:T.inputBg,
              fontSize:13,
              color:"#000",
              outline:"none",
              fontFamily:"inherit",

              // placeholder xám đậm hơn
              "::placeholder": {
                color:T.inputPlaceholder
              }
            }}
          />

          <button
            onClick={handleAdd}
            style={{
              padding:"10px 18px",
              borderRadius:8,
              border:`1px solid ${T.sidebarBtnBorder}`,
              background:T.sidebarBtn,
              color:"#fff",
              fontSize:13,
              fontWeight:700,
              cursor:"pointer",
              transition:"0.15s"
            }}
          >
            Thêm
          </button>
        </div>

        {added && (
          <div style={{
            fontSize:12,
            color:T.CONSTRUCTIVE,
            marginTop:8
          }}>
            ✓ Đã thêm vào hàng đợi crawl
          </div>
        )}
      </Panel>

      <Panel>
        <PanelTitle>
          Nguồn đang theo dõi ({sources.length} video)
        </PanelTitle>

        <table style={{
          width:"100%",
          borderCollapse:"collapse"
        }}>
          <thead>
            <tr style={{
              borderBottom:`1px solid ${T.border}`
            }}>
              {["Kênh","Tiêu đề video","Ngày crawl","Bình luận","",""].map(h=>(
                <th
                  key={h}
                  style={{
                    textAlign:"left",
                    padding:"6px 10px",
                    fontSize:11,
                    fontWeight:600,
                    color:T.textMeta,
                    textTransform:"uppercase",
                    letterSpacing:"0.05em"
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sources.map((s,i)=>(
              <tr
                key={s.id}
                style={{
                  borderBottom:`1px solid ${T.borderLight}`,
                  background:i%2===0 ? T.surface : "#FAFBFC"
                }}
              >
                <td style={{
                  padding:"10px",
                  fontSize:12,
                  fontWeight:600,
                  color:T.text
                }}>
                  {s.channel}
                </td>

                <td style={{
                  padding:"10px",
                  fontSize:12,
                  color:T.textSub,
                  maxWidth:280
                }}>
                  {s.title}
                </td>

                <td style={{
                  padding:"10px",
                  fontSize:12,
                  color:T.textMeta
                }}>
                  {s.date}
                </td>

                <td style={{
                  padding:"10px",
                  fontSize:12,
                  fontWeight:700,
                  color:T.text
                }}>
                  {fmt(s.comments)}
                </td>

                <td style={{ padding:"10px" }}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize:11,
                      color:T.accent,
                      textDecoration:"none"
                    }}
                  >
                    Xem →
                  </a>
                </td>

                {/* nút xóa */}
                <td style={{ padding:"10px" }}>
                  <button
                    onClick={() => handleDelete(s.id)}
                    style={{
                      width:30,
                      height:30,
                      borderRadius:7,
                      border:`1px solid ${T.border}`,
                      background:"#fff",
                      display:"flex",
                      alignItems:"center",
                      justifyContent:"center",
                      cursor:"pointer",
                      transition:"0.15s"
                    }}
                  >
                    <Trash2 size={15} color="#DC2626" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <div style={{
        display:"flex",
        gap:10,
        justifyContent:"flex-end"
      }}>
        <button
          style={{
            padding:"9px 22px",
            borderRadius:7,
            border:`1px solid ${T.border}`,
            background:T.surface,
            fontSize:13,
            fontWeight:600,
            color:T.textSub,
            cursor:"pointer"
          }}
        >
          Lên lịch tự động
        </button>

        <button
          style={{
            padding:"9px 22px",
            borderRadius:7,
            border:"none",

            // xanh lá dịu
            background:T.success,

            color:"#fff",
            fontSize:13,
            fontWeight:700,
            cursor:"pointer",
            transition:"0.15s"
          }}
          onMouseEnter={e=>{
            e.currentTarget.style.background = T.successHover;
          }}
          onMouseLeave={e=>{
            e.currentTarget.style.background = T.success;
          }}
        >
          ▶ Chạy phân tích ngay
        </button>
      </div>
    </div>
  );
}

// ── Comment table tab ─────────────────────────────────────────────────────────
function CommentTab({ policy }) {
  const [labelFilter, setLabelFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const all = policy.comments;
  const filtered = all
    .filter(c => labelFilter==="ALL" || c.label===labelFilter)
    .filter(c => !search || c.text.toLowerCase().includes(search.toLowerCase())
                         || c.author.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {/* Filter bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 2,
          flexWrap: "wrap",
        }}
      >
        {/* Search */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm nội dung hoặc người bình luận..."
          style={{
            flex: 1,
            minWidth: 260,
            height: 40,

            background: "#eaeaea",
            border: "none",
            borderRadius: 8,

            padding: "0 16px",

            fontSize: 13,
            color: "#000000",

            outline: "none",

            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
          }}
        />

        {/* Filters */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {["ALL", "CONSTRUCTIVE", "COMPLAINT", "HOSTILE", "IRRELEVANT"].map(
            (l) => {
              const active = labelFilter === l;

              return (
                <button
                  key={l}
                  onClick={() => setLabelFilter(l)}
                  style={{
                    height: 38,
                    padding: "0 16px",

                    borderRadius: 8,

                    border: active
                      ? `1px solid ${l === "ALL" ? "#93C5FD" : T[l]}`
                      : `1px solid ${T.border}`,

                    background: active
                      ? l === "ALL"
                        ? "#EFF6FF"
                        : `${T[l]}14`
                      : "#FFFFFF",

                    color: active
                      ? l === "ALL"
                        ? "#2563EB"
                        : T[l]
                      : "#6B7280",

                    fontSize: 12,
                    fontWeight: 600,

                    cursor: "pointer",
                    transition: "0.15s",
                    whiteSpace: "nowrap",
                  }}
                >
                  {l === "ALL" ? "Tất cả" : LABEL_VI[l]}
                </button>
              );
            }
          )}
        </div>

        {/* Count */}
        <div
          style={{
            marginLeft: "auto",
            fontSize: 12,
            color: T.textMeta,
            whiteSpace: "nowrap",
          }}
        >
          {filtered.length}/{all.length} bình luận
        </div>
      </div>

      {/* Table */}
      <Panel style={{ padding:0, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#FAFBFC", borderBottom:`1px solid ${T.border}` }}>
              {[
                ["Bình luận","auto"],
                ["Kênh","130px"],
                ["Tiêu đề bài đăng","180px"],
                ["Người bình luận","120px"],
                ["Nhãn","100px"],
                ["Confidence","90px"],
                ["Thời gian","110px"],
                ["Link","50px"],
              ].map(([h,w])=>(
                <th key={h} style={{ textAlign:"left", padding:"10px 14px",
                  fontSize:11, fontWeight:600, color:T.textMeta,
                  textTransform:"uppercase", letterSpacing:"0.05em",
                  width:w, whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length===0 ? (
              <tr><td colSpan={8} style={{ padding:40, textAlign:"center",
                fontSize:13, color:T.textMeta }}>
                Không tìm thấy bình luận phù hợp
              </td></tr>
            ) : filtered.map((c,i)=>(
              <tr key={c.id} style={{
                borderBottom:`1px solid ${T.borderLight}`,
                background: i%2===0 ? T.surface : "#FAFBFC",
              }}>
                <td style={{ padding:"12px 14px", fontSize:12, color:T.text,
                  lineHeight:1.6, maxWidth:260 }}>{c.text}</td>
                <td style={{ padding:"12px 14px", fontSize:12, fontWeight:600,
                  color:T.text, whiteSpace:"nowrap" }}>{c.channel}</td>
                <td style={{ padding:"12px 14px", fontSize:11, color:T.textSub,
                  maxWidth:180 }}>
                  {c.title.length>40 ? c.title.slice(0,40)+"…" : c.title}
                </td>
                <td style={{ padding:"12px 14px", fontSize:12, color:T.textSub }}>
                  {c.author}
                </td>
                <td style={{ padding:"12px 14px" }}>
                  <LabelPill label={c.label} />
                </td>
                <td style={{ padding:"12px 14px" }}>
                  <ConfBar val={c.conf} />
                </td>
                <td style={{ padding:"12px 14px", fontSize:11,
                  color:T.textMeta, whiteSpace:"nowrap" }}>{c.time}</td>
                <td style={{ padding:"12px 14px" }}>
                  <a href={c.link} target="_blank" rel="noreferrer"
                    style={{ fontSize:12, color:T.accent, textDecoration:"none" }}>↗</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {/* Export row */}
      <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
        <button style={{ padding:"7px 16px", borderRadius:7,
          border:`1px solid ${T.border}`, background:T.surface,
          fontSize:12, fontWeight:600, color:T.textSub, cursor:"pointer" }}>
          ⬇ Xuất CSV
        </button>
        <button style={{ padding:"7px 16px", borderRadius:7,
          border:`1px solid ${T.border}`, background:T.surface,
          fontSize:12, fontWeight:600, color:T.textSub, cursor:"pointer" }}>
          ⬇ Xuất Excel
        </button>
      </div>
    </div>
  );
}

// ── Overview tab ──────────────────────────────────────────────────────────────
function OverviewTab({ policy }) {
  const { dist, total, trend } = policy;
  const hostile = dist.HOSTILE;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {/* Alert */}
      {hostile >= 18 && (
        <div style={{ padding:"12px 16px", borderRadius:8,
          background:"#FEF2F2", border:`1px solid #FECACA`,
          fontSize:13, color:"#B91C1C", fontWeight:500 }}>
          <strong>Cảnh báo:</strong> Tỷ lệ bình luận công kích đang ở mức cao ({hostile}%).
          Khuyến nghị rà soát điều khoản gây tranh cãi và tăng cường truyền thông giải thích.
        </div>
      )}

      {/* Row 1 – Donut + Trend */}
      <div style={{ display:"flex", gap:16 }}>
        <Panel style={{ flex:"0 0 280px" }}>
          <PanelTitle>Phân bổ quan điểm</PanelTitle>
          <DonutChart dist={dist} total={total} />
          {/* Legend */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:"8px 16px", marginTop:8 }}>
            {Object.entries(dist).map(([k,v])=>(
              <div key={k} style={{ display:"flex", alignItems:"center", gap:5 }}>
                <div style={{ width:8, height:8, borderRadius:"50%",
                  background:T[k], flexShrink:0 }} />
                <span style={{ fontSize:11, color:T.textSub }}>
                  {LABEL_VI[k]} <strong style={{ color:T.text }}>{v}%</strong>
                </span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel style={{ flex:1 }}>
          <PanelTitle>Xu hướng quan điểm theo ngày</PanelTitle>
          <TrendChart data={trend} />
          {/* Legend */}
          <div style={{ display:"flex", gap:16, marginTop:8 }}>
            {[["C",T.CONSTRUCTIVE,"Xây dựng"],
              ["P",T.COMPLAINT,"Phàn nàn"],
              ["H",T.HOSTILE,"Công kích"]].map(([k,c,name])=>(
              <div key={k} style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:14, height:2.5, background:c, borderRadius:1 }} />
                <span style={{ fontSize:12, color:T.textSub, fontWeight:500 }}>
                  {name}
                </span>
              </div>
            ))}
          </div>

          <div style={{
            marginTop:12,
            padding:"12px 15px",
            background:"#EFF6FF",
            border:"1px solid #BFDBFE",
            borderRadius:8,
            fontSize:12.5,
            color:"#000000",
            lineHeight:1.7
          }}>
            <strong style={{ color:"#000000" }}>Nhận xét:</strong>{" "}
            Tỷ lệ HOSTILE giảm dần sau ngày ban hành, tỷ lệ CONSTRUCTIVE tăng nhẹ —
            dư luận chuyển từ phản ứng cảm xúc sang thảo luận thực chất hơn sau ngày {trend[2]?.day}.
          </div>
        </Panel>
      </div>

      {/* Row 2 – Impact scores + Compare */}
      <div style={{ display:"flex", gap:16 }}>
        <Panel style={{ flex:"0 0 280px" }}>
          <PanelTitle>Chỉ số tác động chính sách</PanelTitle>
          {[
            { label:"Tỷ lệ tiếp nhận tích cực", val:dist.CONSTRUCTIVE, color:T.CONSTRUCTIVE, note:"% bình luận xây dựng" },
            { label:"Chỉ số căng thẳng xã hội", val:Math.min(dist.HOSTILE*3,100), color:T.HOSTILE, note:"Dựa trên tỷ lệ công kích" },
            { label:"Phản hồi hữu ích", val:Math.round(dist.CONSTRUCTIVE/(dist.CONSTRUCTIVE+dist.COMPLAINT)*100), color:T.accent, note:"Xây dựng / (Xây dựng + Phàn nàn)" },
            { label:"Mức độ phản đối", val:dist.COMPLAINT+dist.HOSTILE, color:T.COMPLAINT, note:"Phàn nàn + Công kích" },
          ].map(item=>(
            <div key={item.label} style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between",
                fontSize:12, marginBottom:4 }}>
                <span style={{ color:T.textSub }}>{item.label}</span>
                <span style={{ fontWeight:700, color:item.color }}>{item.val}</span>
              </div>
              <div style={{ height:4, background:T.borderLight, borderRadius:2 }}>
                <div style={{ height:4, width:`${Math.min(item.val,100)}%`,
                  background:item.color, borderRadius:2 }} />
              </div>
              <div style={{ fontSize:10, color:T.textMeta, marginTop:2 }}>{item.note}</div>
            </div>
          ))}

          {/* Recommendation */}
          <div style={{ marginTop:4, padding:"10px 12px",
            background: hostile>=15 ? "#FEF2F2" : "#F0FDF4",
            borderRadius:8, border:`1px solid ${hostile>=15?"#FECACA":"#BBF7D0"}`,
            fontSize:12, color: hostile>=15 ? "#B91C1C" : "#15803D" }}>
            {hostile >= 15
              ? "⚠ Cần tăng truyền thông giải thích chính sách"
              : "✓ Mức phản ứng xã hội trong ngưỡng kiểm soát"}
          </div>
        </Panel>

        <Panel style={{ flex:1 }}>
          <PanelTitle>So sánh phản ứng giữa các chính sách</PanelTitle>
          <CompareBar policies={POLICIES} />
        </Panel>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
function PolicyScope() {
  const [selId, setSelId] = useState(1);
  const [tab, setTab] = useState("overview");
  const [kpiFilter, setKpiFilter] = useState(null);

  const policy = POLICIES.find(p=>p.id===selId);
  const { dist, total } = policy;
  const hostile = dist.HOSTILE;

  return (
    <div style={{ display:"flex", height:"100vh", background:T.bg,
      fontFamily:"'Inter','Segoe UI',system-ui,sans-serif", fontSize:14 }}>

      {/* ── SIDEBAR ── */}
      <div style={{ width:280, background:"#163043", display:"flex",
        flexDirection:"column", flexShrink:0 }}>
       {/* Logo */}
        <div style={{
          padding:"22px 20px 18px",
          borderBottom:"1px solid rgba(255,255,255,0.12)"
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{
              width:32,
              height:32,
              borderRadius:9,
              background:"linear-gradient(135deg,#7DD3FC,#0EA5E9,#0369A1)",
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              fontSize:13,
              fontWeight:900,
              color:"#fff",
              boxShadow:"0 4px 12px rgba(14,165,233,0.25)"
            }}>
              P
            </div>

            <div>
              <div style={{
                fontSize:15,
                fontWeight:700,
                color:"#F8FAFC"
              }}>
                PolicyScope
              </div>

              <div style={{
                fontSize:10,
                color:"#94A3B8",
                letterSpacing:"0.08em",
                textTransform:"uppercase"
              }}>
                Impact Assessment
              </div>
            </div>
          </div>
        </div>
       {/* Nav */}
        <div style={{
          padding:"14px 8px",
          overflowY:"auto",
          flex:1
        }}>
          <div style={{
            fontSize:10,
            fontWeight:700,
            color:"#94A3B8",
            letterSpacing:"0.08em",
            textTransform:"uppercase",
            padding:"0 8px",
            marginBottom:8
          }}>
            Chính sách
          </div>

          {POLICIES.map(p => {
            const isActive = p.id === selId;
            const pDist = p.dist;

            return (
              <div
                key={p.id}
                onClick={()=>{
                  setSelId(p.id);
                  setTab("overview");
                }}
                style={{
                  padding:"12px 12px",
                  borderRadius:10,
                  cursor:"pointer",
                  marginBottom:6,

                  background:isActive
                    ? "rgba(255,255,255,0.06)"
                    : "transparent",

                  border:isActive
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid transparent",

                  boxShadow:isActive
                    ? "inset 0 1px 0 rgba(255,255,255,0.04)"
                    : "none",

                  backdropFilter:isActive
                    ? "blur(6px)"
                    : "none",

                  transition:"all 0.15s ease"
                }}
              >
                <div style={{
                  fontSize:13,
                  fontWeight:700,
                  color:isActive ? "#FFFFFF" : "#E2E8F0",
                  marginBottom:4,
                  lineHeight:1.4
                }}>
                  {p.name}
                </div>

                <div style={{
                  fontSize:11,
                  color:isActive ? "#E0F2FE" : "#94A3B8",
                  marginBottom:8
                }}>
                  {p.subtitle}
                </div>

                {/* mini bar */}
                <div style={{
                  display:"flex",
                  height:4,
                  borderRadius:999,
                  overflow:"hidden",
                  gap:"1px",
                  opacity:isActive ? 1 : 0.9
                }}>
                  {Object.entries(pDist).map(([k,v])=>(
                    <div key={k} style={{ flex:v, background:T[k] }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{
          padding:"14px 14px",
          marginTop:"auto",
          borderTop:"1px solid rgba(255,255,255,0.12)"
        }}>
          <button style={{
            width:"100%",
            padding:"11px",
            borderRadius:10,
            border:"1px solid #0EA5E9",
            background:"#0284C7",
            fontSize:12,
            color:"#FFFFFF",
            cursor:"pointer",
            fontWeight:700,
            transition:"all 0.15s"
          }}>
            + Thêm chính sách
          </button>
        </div>

        {/* Model badge */}
        <div style={{
          padding:"12px 20px 18px",
          fontSize:10,
          color:"#94A3B8",
          lineHeight:1.7
        }}>
          Model: Qwen3-4B Fine-tuned<br/>
          Macro F1: 83.38%
        </div>

        </div>

      {/* ── MAIN ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

        {/* Topbar */}
        <div style={{ background:T.surface, borderBottom:`1px solid ${T.border}`,
          padding:"0 28px", height:52, display:"flex", alignItems:"center",
          gap:16, flexShrink:0 }}>
          <div>
            <span style={{ fontSize:15, fontWeight:700, color:T.text }}>
              {policy.name}
            </span>
            <span style={{ fontSize:13, color:T.textSub, marginLeft:8 }}>
              {policy.subtitle}
            </span>
          </div>
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:12, color:T.textMeta }}>
              Hiệu lực: {policy.date} &nbsp;·&nbsp;
              {policy.sources} nguồn YouTube &nbsp;·&nbsp;
              {fmt(total)} bình luận
            </span>
            {hostile >= 18 && (
              <div style={{ padding:"4px 12px", borderRadius:6,
                background:"#FEF2F2", border:"1px solid #FECACA",
                fontSize:11, fontWeight:700, color:"#B91C1C" }}>
                ⚠ Công kích {hostile}%
              </div>
            )}
          </div>
        </div>

        {/* Content area */}
        <div style={{ flex:1, overflow:"auto", padding:"22px 28px" }}>

          {/* KPI row */}
          <div style={{ display:"grid",
            gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
            {["CONSTRUCTIVE","COMPLAINT","HOSTILE","IRRELEVANT"].map(k=>(
              <KpiCard key={k} colorKey={k}
                pct={dist[k]}
                count={Math.round(total*dist[k]/100)}
                active={kpiFilter===k}
                onClick={()=>setKpiFilter(kpiFilter===k?null:k)} />
            ))}
          </div>

          {/* Tab bar */}
          <div style={{ display:"flex", gap:1, background:T.border,
            borderRadius:8, padding:1, width:"fit-content", marginBottom:20 }}>
            {[
              ["sources","Nguồn & Phân tích"],
              ["overview","Tổng quan"],
              ["comments","Bình luận"],
            ].map(([k,label])=>(
              <button key={k} onClick={()=>setTab(k)} style={{
                padding:"7px 18px", borderRadius:7, border:"none", cursor:"pointer",
                fontSize:12, fontWeight:600,
                background: tab===k ? T.surface : "transparent",
                color: tab===k ? T.text : T.textSub,
                boxShadow: tab===k ? "0 1px 2px #0001" : "none",
                transition:"all 0.12s",
              }}>{label}</button>
            ))}
          </div>

          {/* Tab content */}
          {tab==="sources"  && <SourceTab  policy={policy} />}
          {tab==="overview" && <OverviewTab policy={policy} />}
          {tab==="comments" && <CommentTab  policy={policy} />}
        </div>
      </div>

      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }

        ::-webkit-scrollbar {
          width:5px;
          height:5px;
        }

        ::-webkit-scrollbar-track {
          background:${T.bg};
        }

        ::-webkit-scrollbar-thumb {
          background:#D1D5DB;
          border-radius:4px;
        }

        input,button,select {
          font-family:inherit;
        }

        input::placeholder {
          color: #9CA3AF;
          opacity:1;
        }

        a {
          color:${T.accent};
        }
      `}</style>
    </div>
  );
}
export default PolicyScope;
