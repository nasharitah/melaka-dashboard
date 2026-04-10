import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, ComposedChart, Cell, PieChart, Pie
} from 'recharts';
import { 
  AlertCircle, Clock, Users, TrendingUp, CheckCircle2, Calendar, Download, Target, ChevronRight, Monitor, X, Info
} from 'lucide-react';

const App = () => {
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('TAHUNAN');
  const [isPresenting, setIsPresenting] = useState(false);
  const [showExportHelp, setShowExportHelp] = useState(false);

  const handleExport = () => {
    // Memberi sedikit masa untuk memastikan state render stabil sebelum print
    setTimeout(() => {
      window.print();
    }, 500);
  };

  // Data Sebenar 2025
  const data2025 = [
    { name: 'JAN', kesalahan: 0, kelewatan: 18 },
    { name: 'FEB', kesalahan: 1, kelewatan: 14 },
    { name: 'MAC', kesalahan: 0, kelewatan: 11 },
    { name: 'APR', kesalahan: 2, kelewatan: 13 },
    { name: 'MEI', kesalahan: 0, kelewatan: 10 },
    { name: 'JUN', kesalahan: 0, kelewatan: 11 },
    { name: 'JUL', kesalahan: 1, kelewatan: 16 },
    { name: 'OGOS', kesalahan: 3, kelewatan: 15 },
    { name: 'SEPT', kesalahan: 3, kelewatan: 7 },
    { name: 'OKT', kesalahan: 0, kelewatan: 9 },
    { name: 'NOV', kesalahan: 2, kelewatan: 14 },
    { name: 'DIS', kesalahan: 1, kelewatan: 20 },
  ];

  // Data Sebenar 2026 (Jan & Feb)
  const data2026 = [
    { name: 'JAN', kesalahan: 0, kelewatan: 9 },
    { name: 'FEB', kesalahan: 0, kelewatan: 3 },
    { name: 'MAC', kesalahan: 0, kelewatan: 0 },
    { name: 'APR', kesalahan: 0, kelewatan: 0 },
    { name: 'MEI', kesalahan: 0, kelewatan: 0 },
    { name: 'JUN', kesalahan: 0, kelewatan: 0 },
    { name: 'JUL', kesalahan: 0, kelewatan: 0 },
    { name: 'OGOS', kesalahan: 0, kelewatan: 0 },
    { name: 'SEPT', kesalahan: 0, kelewatan: 0 },
    { name: 'OKT', kesalahan: 0, kelewatan: 0 },
    { name: 'NOV', kesalahan: 0, kelewatan: 0 },
    { name: 'DIS', kesalahan: 0, kelewatan: 0 },
  ];

  const employeeDetails2026 = {
    'JAN': [
      { name: 'Muhammad Ikram', kesalahan: 0, kelewatan: 0 },
      { name: 'Muhammad Taufiq', kesalahan: 0, kelewatan: 4 },
      { name: 'Afi Azreen', kesalahan: 0, kelewatan: 2 },
      { name: 'Mazatulaniza', kesalahan: 0, kelewatan: 3 },
      { name: 'Foroli Dungut', kesalahan: 0, kelewatan: 0 }
    ],
    'FEB': [
      { name: 'Muhammad Ikram', kesalahan: 0, kelewatan: 0 },
      { name: 'Muhammad Taufiq', kesalahan: 0, kelewatan: 1 },
      { name: 'Afi Azreen', kesalahan: 0, kelewatan: 0 },
      { name: 'Mazatulaniza', kesalahan: 0, kelewatan: 2 },
      { name: 'Foroli Dungut', kesalahan: 0, kelewatan: 0 }
    ]
  };

  const employeeDetails2025 = [
    { name: 'Muhammad Ikram', kesalahan: 7, kelewatan: 70 },
    { name: 'Muhammad Taufiq', kesalahan: 3, kelewatan: 37 },
    { name: 'Afi Azreen', kesalahan: 4, kelewatan: 33 },
    { name: 'Mazatulaniza', kesalahan: 1, kelewatan: 14 },
    { name: 'Foroli Dungut', kesalahan: 0, kelewatan: 15 }
  ];

  const processedData = useMemo(() => {
    const numStaff = 5;
    const isYearly = selectedMonth === 'TAHUNAN';
    const activeMonthlySource = selectedYear === '2025' ? data2025 : data2026;
    
    const mistakes = isYearly 
      ? activeMonthlySource.reduce((acc, curr) => acc + curr.kesalahan, 0)
      : (activeMonthlySource.find(m => m.name === selectedMonth)?.kesalahan || 0);
      
    const delays = isYearly 
      ? activeMonthlySource.reduce((acc, curr) => acc + curr.kelewatan, 0)
      : (activeMonthlySource.find(m => m.name === selectedMonth)?.kelewatan || 0);

    const target = (isYearly ? 365 : 31) * numStaff;
    const compliance = (((target - delays) / target) * 100).toFixed(1);

    let employees = [];
    if (selectedYear === '2026') {
      if (isYearly) {
        employees = employeeDetails2026['JAN'].map((e, i) => ({
          name: e.name,
          kesalahan: e.kesalahan + (employeeDetails2026['FEB'][i]?.kesalahan || 0),
          kelewatan: e.kelewatan + (employeeDetails2026['FEB'][i]?.kelewatan || 0)
        }));
      } else {
        employees = employeeDetails2026[selectedMonth] || employeeDetails2026['JAN'].map(e => ({ ...e, kesalahan: 0, kelewatan: 0 }));
      }
    } else {
      const multiplier = isYearly ? 1 : 0.083; 
      employees = employeeDetails2025.map(e => ({
        name: e.name,
        kesalahan: Math.round(e.kesalahan * multiplier),
        kelewatan: Math.round(e.kelewatan * multiplier)
      }));
    }

    return { 
      kpis: { mistakes, delays, compliance, total: mistakes + delays },
      employees: employees.map(e => ({ ...e, total: e.kesalahan + e.kelewatan })).sort((a,b) => b.total - a.total),
      pie: [{ name: 'Kelewatan', value: delays || 0.1 }, { name: 'Kesilapan', value: mistakes || 0 }],
      trend: activeMonthlySource
    };
  }, [selectedMonth, selectedYear]);

  return (
    <div className={`min-h-screen bg-[#050505] p-4 md:p-8 font-sans text-slate-100 transition-all ${isPresenting ? 'p-10' : ''}`}>
      
      <style>
        {`
          @media print {
            @page { size: landscape; margin: 1cm; }
            body { background: white !important; color: black !important; }
            .no-print { display: none !important; }
            .print-only { display: block !important; }
            
            .min-h-screen { background: white !important; padding: 0 !important; height: auto !important; min-height: 0 !important; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            
            /* Selesaikan isu carta kosong dengan memaksa saiz tetap */
            .chart-container { height: 400px !important; width: 100% !important; display: block !important; position: relative !important; }
            .recharts-responsive-container { height: 400px !important; min-height: 400px !important; width: 100% !important; }
            
            .bg-[#050505], .bg-[#0e0e0e], .bg-[#111] { 
              background: #ffffff !important; 
              color: black !important; 
              border: 2px solid #000000 !important;
              box-shadow: none !important;
            }
            
            .text-white, .text-slate-100, .text-slate-300, .text-slate-400, .text-slate-500 { color: black !important; font-weight: bold !important; }
            .text-red-500, .text-orange-500, .text-emerald-500, .text-purple-500 { color: black !important; text-decoration: underline !important; }
            
            h1, h2, h3 { color: black !important; border-bottom: 1px solid #000 !important; padding-bottom: 5px !important; }
            .rounded-3xl, .rounded-[2rem], .rounded-xl { border-radius: 4px !important; border: 1.5px solid #000 !important; }
            
            /* Pastikan grid carta nampak */
            .recharts-cartesian-grid-horizontal line, .recharts-cartesian-grid-vertical line { stroke: #ddd !important; stroke-opacity: 1 !important; }
          }
          .print-only { display: none; }
        `}
      </style>

      {/* HEADER */}
      {!isPresenting && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-white/10 pb-6 no-print">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-600 text-[10px] font-black px-2 py-0.5 rounded text-white tracking-widest uppercase italic">Analisis METAR</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
              <Target className="text-blue-500" size={32} /> Dashboard Analisis METAR
            </h1>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-[0.2em] mt-1">Laporan Prestasi Pegawai</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-[#111] p-2 rounded-xl border border-white/10">
              <Calendar size={16} className="text-slate-500" />
              <select className="bg-transparent text-sm font-bold text-white outline-none" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                <option value="2026" className="bg-[#111]">Tahun 2026</option>
                <option value="2025" className="bg-[#111]">Tahun 2025</option>
              </select>
            </div>
            <div className="flex items-center gap-2 bg-[#111] p-2 rounded-xl border border-white/10">
              <select className="bg-transparent text-sm font-bold text-white outline-none" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                <option value="TAHUNAN" className="bg-[#111]">Paparan Tahunan</option>
                {['JAN', 'FEB', 'MAC', 'APR', 'MEI', 'JUN', 'JUL', 'OGOS', 'SEPT', 'OKT', 'NOV', 'DIS'].map(m => (
                  <option key={m} value={m} className="bg-[#111]" disabled={selectedYear === '2026' && !['JAN', 'FEB', 'TAHUNAN'].includes(m)}>{m}</option>
                ))}
              </select>
            </div>
            <button onClick={() => setIsPresenting(true)} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-white/10">
              <Monitor size={16} /> Present
            </button>
            <button onClick={handleExport} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-900/20">
              <Download size={16} /> Eksport PDF
            </button>
          </div>
        </div>
      )}

      {/* TAJUK CETAKAN (HANYA MUNCUL DALAM PDF) */}
      <div className="print-only mb-10 text-center border-b-4 border-black pb-4">
         <h1 className="text-5xl font-black text-black uppercase tracking-tighter">LAPORAN PRESTASI METAR {selectedYear}</h1>
         <p className="text-2xl font-bold text-slate-700 uppercase tracking-[0.4em] mt-3">
           {selectedMonth === 'TAHUNAN' ? 'Analisis Keseluruhan Tahunan' : `Analisis Terperinci Bulan ${selectedMonth}`}
         </p>
         <div className="flex justify-between mt-6 text-sm font-bold text-slate-500 uppercase">
           <span>Unit Pentadbiran</span>
           <span>Tarikh Cetakan: {new Date().toLocaleDateString('ms-MY')}</span>
         </div>
      </div>

      {isPresenting && (
        <div className="mb-12 text-center no-print">
           <h1 className="text-6xl font-black text-white tracking-tighter mb-2 underline decoration-blue-500">Dashboard Analisis METAR {selectedYear}</h1>
           <p className="text-blue-500 text-2xl font-bold uppercase tracking-[0.5em]">{selectedMonth === 'TAHUNAN' ? 'Rumusan Tahunan' : `Analisis Bulan ${selectedMonth}`}</p>
        </div>
      )}

      {isPresenting && (
        <button onClick={() => setIsPresenting(false)} className="fixed top-6 right-6 z-50 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white p-3 rounded-full border border-red-500/50 no-print">
          <X size={24} />
        </button>
      )}

      {/* KPI SECTION */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 ${isPresenting ? 'gap-12 scale-110 mt-10 origin-top' : ''}`}>
        <KPICard title="Bilangan Kesalahan" value={processedData.kpis.mistakes} icon={<AlertCircle size={isPresenting ? 40 : 24} className="text-red-500" />} color="red" status="Kualiti" large={isPresenting} />
        <KPICard title="Bilangan Kelewatan" value={processedData.kpis.delays} icon={<Clock size={isPresenting ? 40 : 24} className="text-orange-500" />} color="orange" status="Disiplin" isCritical={processedData.kpis.delays > 15} large={isPresenting} />
        <KPICard title="Ketepatan Masa" value={`${processedData.kpis.compliance}%`} icon={<CheckCircle2 size={isPresenting ? 40 : 24} className="text-emerald-500" />} color="emerald" status="Pematuhan" large={isPresenting} />
        <KPICard title="Individu Kritikal" value={processedData.employees[0]?.total > 0 ? processedData.employees[0]?.name.split(' ')[1] : "-"} icon={<TrendingUp size={isPresenting ? 40 : 24} className="text-purple-500" />} color="purple" status="Pekerja" large={isPresenting} />
      </div>

      {/* CARTA BAR PEKERJA */}
      <div className={`grid grid-cols-1 ${isPresenting ? 'lg:grid-cols-1 mt-10' : 'lg:grid-cols-3'} gap-8 mb-10`}>
        <div className={`${isPresenting ? 'lg:col-span-1' : 'lg:col-span-2'} bg-[#0e0e0e] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden chart-container`}>
          <h2 className={`${isPresenting ? 'text-3xl' : 'text-xl'} font-bold text-white uppercase tracking-widest mb-10`}>Ranking Isu Mengikut Pekerja</h2>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={processedData.employees} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#222" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tick={{ fontSize: isPresenting ? 16 : 11, fill: '#94a3b8', fontWeight: 600 }} width={160} />
                <Tooltip cursor={{ fill: '#ffffff03' }} contentStyle={{ backgroundColor: '#000', border: '1px solid #333', color: '#fff' }} />
                <Legend />
                <Bar dataKey="kelewatan" name="Bil. Kelewatan" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={35} isAnimationActive={false} />
                <Bar dataKey="kesalahan" name="Bil. Kesalahan" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={35} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART */}
        {!isPresenting && (
          <div className="bg-[#0e0e0e] p-8 rounded-3xl border border-white/5 shadow-2xl flex flex-col items-center chart-container">
            <h2 className="text-xl font-bold mb-10 text-white uppercase tracking-widest self-start">Taburan Punca Kes</h2>
            <div className="relative h-[280px] w-full">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={processedData.pie} innerRadius={85} outerRadius={115} paddingAngle={8} dataKey="value" isAnimationActive={false}>
                    <Cell fill="#f59e0b" stroke="none" /><Cell fill="#ef4444" stroke="none" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-5xl font-black block text-white tracking-tighter">{processedData.kpis.total}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Kes Aktif</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TREND ANALISIS */}
      {!isPresenting && (
        <div className="bg-[#0e0e0e] p-8 rounded-3xl border border-white/5 shadow-2xl mb-10 chart-container">
          <h2 className="text-xl font-bold mb-10 text-white uppercase tracking-widest">Trend Prestasi Bulanan ({selectedYear})</h2>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={processedData.trend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fill: '#64748b' }} />
                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                <Legend verticalAlign="top" align="right" />
                <Bar dataKey="kelewatan" name="Bil. Kelewatan" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={45} opacity={0.8} isAnimationActive={false} />
                <Line type="monotone" dataKey="kesalahan" name="Bil. Kesalahan" stroke="#ef4444" strokeWidth={5} dot={{ r: 7, fill: '#ef4444', strokeWidth: 0 }} isAnimationActive={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* RUMUSAN EKSEKUTIF */}
      {!isPresenting && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <SummaryBox title="Penemuan Utama" color="blue">
            <ul className="text-sm space-y-5">
              <li className="flex gap-4 items-start"><ChevronRight className="text-blue-500 shrink-0 mt-1" size={20} /><span>Prestasi awal 2026 menunjukkan peningkatan disiplin mendadak dengan sifar kesilapan kerja direkodkan.</span></li>
              <li className="flex gap-4 items-start"><ChevronRight className="text-blue-500 shrink-0 mt-1" size={20} /><span>Kelewatan Januari 2026 (9 kes) adalah <b>50% lebih rendah</b> berbanding Januari 2025 (18 kes).</span></li>
            </ul>
          </SummaryBox>

          <SummaryBox title="Fokus Pengurusan" color="red">
            <div className="space-y-5">
              {processedData.employees.slice(0, 2).map((emp, i) => (
                <div key={i} className="flex justify-between items-center p-5 bg-red-950/20 border border-red-500/20 rounded-2xl">
                   <span className="text-base font-bold">{emp.name}</span>
                   <span className="text-sm font-black text-red-500 uppercase px-3 py-1 bg-red-500/10 rounded-lg">{emp.total} Kes</span>
                </div>
              ))}
            </div>
          </SummaryBox>

          <SummaryBox title="Cadangan Tindakan" color="emerald">
             <ul className="text-sm space-y-5">
              <li className="flex gap-4 items-start"><CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-1" /><span>Kekalkan momentum <b>Sifar Kesalahan</b> kualiti dengan audit dwi-mingguan.</span></li>
              <li className="flex gap-4 items-start"><CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-1" /><span>Berikan pengiktirafan kepada pegawai yang mencatatkan rekod 100% tepat pada waktu.</span></li>
            </ul>
          </SummaryBox>
        </div>
      )}
      
      <div className="mt-20 text-center border-t border-white/5 pt-10 no-print opacity-40 italic font-bold">
        <p className="text-[11px] text-slate-500 uppercase tracking-[0.5em]">Dashboard Analisis METAR &bull; Hak Cipta Terpelihara</p>
      </div>

      <div className="print-only mt-20 text-center text-[10px] text-black border-t-2 border-black pt-6 font-bold uppercase tracking-widest">
        DOKUMEN INI ADALAH SULIT & UNTUK KEGUNAAN DALAMAN SAHAJA
      </div>
    </div>
  );
};

const KPICard = ({ title, value, icon, color, status, isCritical, large }) => {
  const themes = {
    red: 'border-red-500/20 bg-red-500/5 text-red-500',
    orange: 'border-orange-500/20 bg-orange-500/5 text-orange-500',
    emerald: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500',
    purple: 'border-purple-500/20 bg-purple-500/5 text-purple-500',
  };

  return (
    <div className={`${large ? 'p-12' : 'p-8'} rounded-[2.5rem] border ${themes[color]} shadow-2xl relative overflow-hidden group`}>
      {isCritical && <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rotate-45 translate-x-16 -translate-y-16 animate-pulse no-print"></div>}
      <div className="flex justify-between items-start mb-10">
        <div className={`${large ? 'p-8' : 'p-5'} bg-black/40 rounded-3xl border border-white/5 shadow-inner`}>{icon}</div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">{status}</span>
      </div>
      <div className={`${large ? 'text-lg' : 'text-[12px]'} font-black text-slate-500 uppercase tracking-[0.3em] mb-3`}>{title}</div>
      <div className={`${large ? 'text-8xl' : 'text-6xl'} font-black text-white tracking-tighter`}>{value}</div>
    </div>
  );
};

const SummaryBox = ({ title, children, color }) => {
  const borderColors = { blue: 'border-blue-500/20 bg-blue-500/5', red: 'border-red-500/20 bg-red-500/5', emerald: 'border-emerald-500/20 bg-emerald-500/5' };
  const titleColors = { blue: 'text-blue-500', red: 'text-red-500', emerald: 'text-emerald-500' };
  return (
    <div className={`p-10 rounded-[3rem] border ${borderColors[color]} shadow-2xl`}>
      <h3 className={`text-[12px] font-black uppercase tracking-[0.5em] mb-10 ${titleColors[color]}`}>{title}</h3>
      <div className="text-slate-300 font-medium leading-relaxed">{children}</div>
    </div>
  );
};

export default App;