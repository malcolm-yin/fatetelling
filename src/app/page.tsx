'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [gmtOffset, setGmtOffset] = useState<string>('');
  const [lunarDate, setLunarDate] = useState<string>('');
  const [formData, setFormData] = useState({
    year: '',
    month: '',
    day: '',
    hour: '',
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const localTime = now.toLocaleString('en-US', {
        hour12: false,
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      const gmtOffsetHours = -now.getTimezoneOffset() / 60;
      const gmtSign = gmtOffsetHours >= 0 ? '+' : '-';
      const gmtFormatted = `GMT${gmtSign}${Math.abs(gmtOffsetHours)}`;

      setCurrentTime(localTime.replace(',', ' '));
      setGmtOffset(gmtFormatted);
    };

    updateTime(); // 初次执行
    const interval = setInterval(updateTime, 1000); // 每秒更新
    return () => clearInterval(interval); // 清理定时器
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 调用后端 API
    const res = await fetch('/api/convert-to-lunar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    setLunarDate(data.lunarDate);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Current Time</h1>
      <p className="text-lg mb-2">Local Time: {currentTime}</p>
      <p className="text-lg">Timezone: {gmtOffset}</p>

      <form onSubmit={handleSubmit} className="mt-8">
        <div className="flex flex-col space-y-4">
          <input
            type="number"
            name="year"
            placeholder="Year (e.g., 1995)"
            value={formData.year}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="number"
            name="month"
            placeholder="Month (1-12)"
            value={formData.month}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="number"
            name="day"
            placeholder="Day (optional)"
            value={formData.day}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            name="hour"
            placeholder="Hour (optional)"
            value={formData.hour}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>

      {lunarDate && (
        <div className="mt-4">
          <h2 className="text-lg font-bold">Lunar Date:</h2>
          <p>{lunarDate}</p>
        </div>
      )}
    </div>
  );
}
