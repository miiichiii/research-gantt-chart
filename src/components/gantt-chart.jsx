"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Download, Upload, AlertCircle } from 'lucide-react';

const GanttChart = () => {
  const [tasks, setTasks] = useState([
    { id: 1, name: "文献レビュー", start: "2025-03-01", end: "2025-04-15", color: "#4287f5", progress: 60 },
    { id: 2, name: "実験計画の策定", start: "2025-03-15", end: "2025-04-30", color: "#42c5f5", progress: 100 },
    { id: 3, name: "予備実験", start: "2025-04-15", end: "2025-05-31", color: "#41f4a0", progress: 100 },
    { id: 4, name: "本実験", start: "2025-06-01", end: "2025-08-31", color: "#f4ca41", progress: 0 },
    { id: 5, name: "データ解析", start: "2025-08-15", end: "2025-10-15", color: "#f48c41", progress: 0 },
    { id: 6, name: "論文執筆", start: "2025-10-01", end: "2025-12-15", color: "#f44141", progress: 0 }
  ]);
  
  const [newTask, setNewTask] = useState({
    name: "",
    start: "",
    end: "",
    color: "#4287f5",
    progress: 0
  });
  
  const [startDate, setStartDate] = useState("2025-03-01");
  const [endDate, setEndDate] = useState("2025-12-31");
  const [months, setMonths] = useState([]);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    calculateMonths();
  }, [startDate, endDate]);

  const calculateMonths = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const monthsList = [];
    
    let current = new Date(start);
    current.setDate(1);
    
    while (current <= end) {
      const year = current.getFullYear();
      const month = current.getMonth();
      monthsList.push(new Date(year, month, 1));
      current.setMonth(month + 1);
    }
    
    setMonths(monthsList);
  };

  const getTaskPosition = (task) => {
    const start = new Date(task.start);
    const end = new Date(task.end);
    const projectStart = new Date(startDate);
    const projectEnd = new Date(endDate);
    
    const totalDays = (projectEnd - projectStart) / (1000 * 60 * 60 * 24);
    const taskStartOffset = (start - projectStart) / (1000 * 60 * 60 * 24);
    const taskDuration = (end - start) / (1000 * 60 * 60 * 24);
    
    const left = (taskStartOffset / totalDays) * 100;
    const width = (taskDuration / totalDays) * 100;
    
    return { left: `${left}%`, width: `${width}%` };
  };

  const handleAddTask = () => {
    if (newTask.name && newTask.start && newTask.end) {
      const taskId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
      setTasks([...tasks, { ...newTask, id: taskId }]);
      setNewTask({ name: "", start: "", end: "", color: "#4287f5", progress: 0 });
    }
  };

  const confirmDelete = (id) => {
    setTaskToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteTask = () => {
    if (taskToDelete) {
      setTasks(tasks.filter(task => task.id !== taskToDelete));
      setShowDeleteConfirm(false);
      setTaskToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setTaskToDelete(null);
  };

  const handleTaskChange = (id, field, value) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, [field]: value } : task
    ));
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short' });
  };

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "research_schedule.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };
  
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedTasks = JSON.parse(e.target.result);
        if (Array.isArray(importedTasks) && importedTasks.length > 0) {
          setTasks(importedTasks);
        } else {
          alert('有効なタスクデータが含まれていません。');
        }
      } catch (error) {
        console.error('ファイル読み込みエラー:', error);
        alert('ファイルの形式が正しくありません。JSONファイルを選択してください。');
      }
    };
    reader.readAsText(file);
    
    // ファイル選択をリセット（同じファイルを再度選択できるように）
    event.target.value = '';
  };

  // 削除確認モーダルをコンポーネント内で直接レンダリング

  return (
    <div className="flex flex-col space-y-6 w-full">
      {/* 削除確認モーダル */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex items-center text-red-500 mb-4">
              <AlertCircle className="mr-2" />
              <h3 className="text-lg font-medium">タスク削除の確認</h3>
            </div>
            <p className="mb-6">「{tasks.find(t => t.id === taskToDelete)?.name || "このタスク"}」を削除してもよろしいですか？この操作は元に戻せません。</p>
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 border rounded"
                onClick={cancelDelete}
              >
                キャンセル
              </button>
              <button 
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={handleDeleteTask}
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">研究プロジェクトスケジュール</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex space-x-4">
              <div className="flex flex-col w-1/4">
                <label className="text-sm font-medium">開始日</label>
                <input 
                  type="date" 
                  className="p-2 border rounded" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex flex-col w-1/4">
                <label className="text-sm font-medium">終了日</label>
                <input 
                  type="date" 
                  className="p-2 border rounded" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="gantt-container overflow-x-auto">
              <div className="flex">
                <div className="task-labels w-1/4 pr-2">
                  <div className="p-2 font-medium">タスク</div>
                  {tasks.map(task => (
                    <div key={task.id} className="task-row flex items-center justify-between p-2 border-t">
                      <input 
                        type="text" 
                        className="w-full border-none p-1 text-sm" 
                        value={task.name} 
                        onChange={(e) => handleTaskChange(task.id, 'name', e.target.value)}
                      />
                      <button 
                        className="text-red-500 ml-2"
                        onClick={() => confirmDelete(task.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="chart-area w-3/4 overflow-x-auto">
                  <div className="timeline-header flex">
                    {months.map((month, index) => (
                      <div key={index} className="month-header text-center p-2 border-l" style={{ width: '100px', minWidth: '100px' }}>
                        {formatMonthYear(month)}
                      </div>
                    ))}
                  </div>
                  
                  <div className="gantt-chart relative">
                    {tasks.map(task => (
                      <div key={task.id} className="task-row flex relative h-10 border-t">
                        <div className="month-grid absolute top-0 bottom-0 left-0 right-0 flex">
                          {months.map((month, index) => (
                            <div key={index} className="border-l" style={{ width: '100px', minWidth: '100px' }}></div>
                          ))}
                        </div>
                        
                        <div 
                          className="task-bar absolute rounded flex items-center px-2 text-black text-xs overflow-hidden"
                          style={{
                            ...getTaskPosition(task),
                            backgroundColor: "#e0e0e0",
                            top: '4px',
                            height: '24px'
                          }}
                        >
                          <div 
                            className="progress-bar absolute top-0 bottom-0 left-0"
                            style={{ 
                              width: `${task.progress}%`,
                              backgroundColor: task.color
                            }}
                          ></div>
                          <span className="z-10 relative">{task.name} ({task.progress}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="add-task mt-4 p-4 border rounded">
              <h3 className="text-lg font-medium mb-2">新しいタスクを追加</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium">タスク名</label>
                  <input 
                    type="text" 
                    className="p-2 border rounded" 
                    value={newTask.name} 
                    onChange={(e) => setNewTask({...newTask, name: e.target.value})}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium">開始日</label>
                  <input 
                    type="date" 
                    className="p-2 border rounded" 
                    value={newTask.start} 
                    onChange={(e) => setNewTask({...newTask, start: e.target.value})}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium">終了日</label>
                  <input 
                    type="date" 
                    className="p-2 border rounded" 
                    value={newTask.end} 
                    onChange={(e) => setNewTask({...newTask, end: e.target.value})}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium">色</label>
                  <input 
                    type="color" 
                    className="p-2 border rounded h-10" 
                    value={newTask.color} 
                    onChange={(e) => setNewTask({...newTask, color: e.target.value})}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium">進捗率 (%)</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    className="p-2 border rounded" 
                    value={newTask.progress} 
                    onChange={(e) => setNewTask({...newTask, progress: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="flex items-end">
                  <button 
                    className="p-2 bg-blue-500 text-white rounded flex items-center"
                    onClick={handleAddTask}
                  >
                    <Plus size={16} className="mr-1" /> タスク追加
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <label className="p-2 bg-blue-500 text-white rounded flex items-center cursor-pointer">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
                <Upload size={16} className="mr-1" /> スケジュールをインポート
              </label>
              <button 
                className="p-2 bg-green-500 text-white rounded flex items-center"
                onClick={handleDownload}
              >
                <Download size={16} className="mr-1" /> スケジュールをダウンロード
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium">タスク一覧と進捗管理</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">タスク名</th>
                  <th className="p-2 text-left">開始日</th>
                  <th className="p-2 text-left">終了日</th>
                  <th className="p-2 text-left">進捗率</th>
                  <th className="p-2 text-left">操作</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id} className="border-t">
                    <td className="p-2">{task.id}</td>
                    <td className="p-2">
                      <input 
                        type="text" 
                        className="w-full p-1 border rounded" 
                        value={task.name} 
                        onChange={(e) => handleTaskChange(task.id, 'name', e.target.value)}
                      />
                    </td>
                    <td className="p-2">
                      <input 
                        type="date" 
                        className="w-full p-1 border rounded" 
                        value={task.start} 
                        onChange={(e) => handleTaskChange(task.id, 'start', e.target.value)}
                      />
                    </td>
                    <td className="p-2">
                      <input 
                        type="date" 
                        className="w-full p-1 border rounded" 
                        value={task.end} 
                        onChange={(e) => handleTaskChange(task.id, 'end', e.target.value)}
                      />
                    </td>
                    <td className="p-2">
                      <input 
                        type="number" 
                        min="0" 
                        max="100"
                        className="w-24 p-1 border rounded" 
                        value={task.progress} 
                        onChange={(e) => handleTaskChange(task.id, 'progress', parseInt(e.target.value) || 0)}
                      />
                    </td>
                    <td className="p-2">
                      <button 
                        className="p-1 text-red-500"
                        onClick={() => confirmDelete(task.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GanttChart;