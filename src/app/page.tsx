"use client"
import GanttChart from '@/components/gantt-chart';

export default function Home() {
  return (
    <main className="p-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">研究プロジェクト管理ツール</h1>
      <GanttChart />
    </main>
  );
}
