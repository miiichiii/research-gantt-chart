import GanttChart from '@/components/gantt-chart';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-12">
      <h1 className="text-3xl font-bold mb-8">研究プロジェクト管理ツール</h1>
      <GanttChart />
    </main>
  );
}