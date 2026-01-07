
import React, { useState, useEffect } from 'react';
import { generateCalendar2026, downloadAsJSON } from './utils';
import { ExerciseLog, MonthData } from './types';
import { STORAGE_KEY, MONTH_COLORS } from './constants';

const App: React.FC = () => {
  const [logs, setLogs] = useState<ExerciseLog>({});
  const [calendarData] = useState<MonthData[]>(generateCalendar2026());
  const [isSaved, setIsSaved] = useState(false);

  // ==========================================
  // 【圖片設定區】請在這裡填入您的 Google Drive 檔案 ID
  // 您的網址是：https://drive.google.com/file/d/1hbDYnu_eZh_1qY12NORteQTWEcqeONSD/view
  // ==========================================
  const GOOGLE_DRIVE_ID = '1hbDYnu_eZh_1qY12NORteQTWEcqeONSD';
  const idolImageUrl = `https://lh3.googleusercontent.com/d/${GOOGLE_DRIVE_ID}`;

  useEffect(() => {
    const savedLogs = localStorage.getItem(STORAGE_KEY);
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error("Failed to parse saved logs", e);
      }
    }
  }, []);

  const handleInputChange = (dateKey: string, value: string) => {
    setLogs(prev => ({ ...prev, [dateKey]: value }));
    setIsSaved(false);
  };

  const saveAndDownload = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    downloadAsJSON(logs, `exercise_log_2026.json`);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header Section */}
      <header className="px-6 py-10 md:px-12 flex flex-col md:flex-row items-center justify-between text-white max-w-[1600px] mx-auto gap-8">
        <div className="flex items-center gap-6 md:gap-8 flex-col md:flex-row text-center md:text-left">
          <div className="relative">
            {/* 偶像特寫圖案區塊 */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-[5px] border-white/40 overflow-hidden shadow-2xl bg-[#2a244a] flex items-center justify-center">
              <img 
                src={idolImageUrl} 
                alt="LingOrm Close Up" 
                className="w-full h-full object-cover scale-125 object-center"
                style={{ objectPosition: 'center 20%' }}
                onError={(e) => {
                   console.warn("圖片讀取失敗！請確認 Google Drive 檔案權限已開啟為『知道連結的任何人皆可檢視』");
                   e.currentTarget.style.display = 'none';
                   e.currentTarget.parentElement!.style.background = 'linear-gradient(45deg, #a855f7, #ec4899)';
                }}
              />
            </div>
            <div className="absolute bottom-2 right-2 bg-pink-500 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-lg md:text-xl shadow-md animate-pulse">
              💜
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-6xl font-black tracking-tight leading-tight">2026 運動記錄年曆</h1>
            <p className="text-lg md:text-xl font-bold mt-2 md:mt-4 tracking-widest opacity-90 uppercase">TIME OFF WORK WORKS!</p>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-3 font-semibold text-purple-300 text-base md:text-lg">
              <span className="text-pink-400">💜</span>
              <span>Inspired by LingOrm</span>
            </div>
          </div>
        </div>

        <button 
          onClick={saveAndDownload}
          className="w-full md:w-auto bg-[#a855f7] hover:bg-[#9333ea] transition-all px-8 md:px-10 py-4 rounded-2xl font-black text-lg md:text-xl flex items-center justify-center gap-3 shadow-xl active:scale-95 group"
        >
          <i className={`fa-solid ${isSaved ? 'fa-check scale-125' : 'fa-save group-hover:rotate-12'} transition-transform`}></i>
          <span>{isSaved ? '儲存成功' : '儲存記錄'}</span>
        </button>
      </header>

      {/* Main Calendar Section - Responsive Grid */}
      <main className="max-w-[1600px] mx-auto px-4 md:px-6">
        <div className="calendar-card">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-12">
            {calendarData.map((month, idx) => (
              <MonthColumn 
                key={month.name} 
                month={month} 
                logs={logs} 
                onInputChange={handleInputChange} 
                color={MONTH_COLORS[idx]} 
              />
            ))}
          </div>
        </div>
      </main>

      <footer className="mt-16 text-center text-white/40 text-sm md:text-base px-6 no-print">
        <p>© 2026 Exercise Tracker // TIME OFF WORK WORKS!</p>
        <p className="mt-2 tracking-widest font-medium text-purple-400/60 uppercase">Keep moving for the ones you love!</p>
      </footer>
    </div>
  );
};

interface MonthColumnProps {
  month: MonthData;
  logs: ExerciseLog;
  onInputChange: (dateKey: string, value: string) => void;
  color: string;
}

const MonthColumn: React.FC<MonthColumnProps> = ({ month, logs, onInputChange, color }) => {
  return (
    <div className="flex flex-col">
      {/* Month Header - Pill Shape */}
      <div 
        className="text-center py-2 px-6 rounded-full text-white font-black text-sm mb-6 shadow-md uppercase tracking-[0.2em]"
        style={{ backgroundColor: color }}
      >
        {month.shortName}
      </div>
      
      {/* Days List */}
      <div className="flex flex-col">
        {month.days.map((day) => (
          <div key={day.dateKey} className="day-row flex items-center gap-2 py-1.5 px-1 hover:bg-gray-50 transition-colors border-b border-gray-50">
            {/* 確保日期與星期固定左右，且不換行 */}
            <span className={`text-[12px] md:text-[13px] w-11 shrink-0 font-bold whitespace-nowrap ${day.isWeekend ? 'text-red-500' : 'text-pink-500/60'}`}>
              <span className="inline-block w-5">{day.date}</span>
              <span className="ml-1">{day.dayOfWeek}</span>
            </span>
            <input
              type="text"
              placeholder="運動項目"
              value={logs[day.dateKey] || ''}
              onChange={(e) => onInputChange(day.dateKey, e.target.value)}
              className="flex-1 min-w-0 bg-transparent text-[12px] md:text-[13px] text-gray-700 font-semibold focus:outline-none placeholder:text-gray-200"
              spellCheck={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
