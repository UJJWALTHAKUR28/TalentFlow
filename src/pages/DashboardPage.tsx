import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Cell } from "recharts";

interface Totals {
  jobs: number;
  candidates: number;
  assessments: number;
}

interface StageCount {
  stage: string;
  count: number;
}

export default function Dashboard() {
  const [totals, setTotals] = useState<Totals>({ jobs: 0, candidates: 0, assessments: 0 });
  const [loading, setLoading] = useState(true);
  const [stageData, setStageData] = useState<StageCount[]>([]);

  useEffect(() => {
  const fetchTotals = async () => {
  try {
    const jobsRes = await fetch("/api/jobs?page=1&pageSize=1");
    const jobsData = await jobsRes.json();

    const candidatesRes = await fetch("/api/candidates?page=1&pageSize=100");
    const candidatesData = await candidatesRes.json();

    const jobsListRes = await fetch("/api/jobs?page=1&pageSize=100");
    const jobsListData = await jobsListRes.json();

    let totalAssessments = 0;
    for (const job of jobsListData.data) {
      const res = await fetch(`/api/assessments/${job.id}`);
      if (res.ok) {
        const data = await res.json();
        totalAssessments += data.length;
      }
    }

    setTotals({
      jobs: jobsData.total || 0,
      candidates: candidatesData.total || 0,
      assessments: totalAssessments,
    });

    // Fetch all candidates
    let allCandidates: any[] = [];
    let page = 1;
    let pageSize = 100;
    let totalPages = 1;

    do {
      const res = await fetch(`/api/candidates?page=${page}&pageSize=${pageSize}`);
      const data = await res.json();
      allCandidates = allCandidates.concat(data.data);
      totalPages = Math.ceil(data.total / pageSize);
      page++;
    } while (page <= totalPages);

    // Process stage counts for ALL candidates
    const stageMap: Record<string, number> = {};
    allCandidates.forEach((cand) => {
      const stage = cand.stage || "Applied";
      stageMap[stage] = (stageMap[stage] || 0) + 1;
    });

    setStageData(Object.keys(stageMap).map(stage => ({ stage, count: stageMap[stage] })));
  } catch (err) {
    console.error("Failed to fetch totals:", err);
    alert("Refresh/ Reload site");
  } finally {
    setLoading(false);
  }
};



    fetchTotals();
  }, []);

  
  const getBarColor = (stage: string) => { 
    const lowerStage = stage.toLowerCase(); 
    if (lowerStage.includes('reject')) return '#ef4444'; 
    if (lowerStage.includes('screen')) return '#3B7080'; 
    if (lowerStage.includes('applied')) return '#3b82f6'; 
    if (lowerStage.includes('offer')) return '#CFFFB3'; 
    if (lowerStage.includes('interview')) return '#f59e0b'; 
    if (lowerStage.includes('hired')) return '#10b981'; return '#22577a'; };

  return (
    <div className="min-h-screen bg-white p-6 md:p-8">
     
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-[#00241B] rounded-xl shadow-sm px-8 py-12 text-center border border-[#93E5AB]/20">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            TalentFlow Dashboard
          </h1>
          <p className="text-lg text-[#93E5AB] max-w-2xl mx-auto leading-relaxed">
            Streamline your hiring process — manage jobs, track candidates, and create assessments all in one place.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#93E5AB]/10 rounded-xl p-6 border border-[#93E5AB]/30">
            <h3 className="text-lg font-semibold text-[#00241B] mb-2">📊 Real-Time Analytics</h3>
            <p className="text-slate-700">
              Monitor your recruitment metrics at a glance. Track job postings, candidate flow, and assessment completion rates to optimize your hiring strategy.
            </p>
          </div>
          <div className="bg-[#00241B]/5 rounded-xl p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-[#00241B] mb-2">🎯 Pipeline Insights</h3>
            <p className="text-slate-700">
              Visualize candidate progression through each stage. Identify bottlenecks and make data-driven decisions to improve your recruitment funnel.
            </p>
          </div>
        </div>
      </div>

   
      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-3 text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-[#93E5AB] border-t-[#00241B] rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-600">Loading dashboard data...</p>
            </div>
          ) : (
            <>
              <StatCard 
                label="Total Jobs" 
                value={totals.jobs} 
                bgColor="bg-[#00241B]"
                textColor="text-[#93E5AB]"
                valueColor="text-white"
              />
              <StatCard 
                label="Total Candidates" 
                value={totals.candidates} 
                bgColor="bg-[#93E5AB]"
                textColor="text-[#00241B]"
                valueColor="text-[#00241B]"
              />
              <StatCard 
                label="Total Assessments" 
                value={totals.assessments} 
                bgColor="bg-[#00241B]"
                textColor="text-[#93E5AB]"
                valueColor="text-white"
              />
            </>
          )}
        </div>
      </div>

  
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#00241B] mb-2">
              Candidate Pipeline Overview
            </h2>
            <p className="text-slate-600">
              Track candidate distribution across different stages of your hiring process
            </p>
          </div>
          
          {stageData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={stageData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="stage" 
                  tick={{ fill: '#475569', fontSize: 13 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis 
                  tick={{ fill: '#475569', fontSize: 13 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#93E5AB',
                    fontWeight: 600
                  }}
                  cursor={{ fill: '#93E5AB', opacity: 0.1 }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Bar 
                  dataKey="count" 
                  radius={[8, 8, 0, 0]}
                  name="Candidates"
                  animationDuration={800}
                >
                  {stageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.stage)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-slate-500">
              No candidate data available yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  label, 
  value, 
  bgColor,
  textColor,
  valueColor
}: { 
  label: string; 
  value: number; 
  bgColor: string;
  textColor: string;
  valueColor: string;
}) {
  return (
    <div className={`${bgColor} rounded-xl shadow-sm p-6 transition-transform hover:scale-105 duration-200`}>
      <div className="flex flex-col items-center justify-center text-center">
        <div className={`text-5xl font-bold ${valueColor} mb-3`}>
          {value}
        </div>
        <div className={`text-sm font-semibold uppercase tracking-wider ${textColor}`}>
          {label}
        </div>
      </div>
    </div>
  );
}
