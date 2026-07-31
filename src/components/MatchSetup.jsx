import React, { useState } from 'react';
import { ShieldCheck, Play, Settings2, Trophy, Flame } from 'lucide-react';
import { useHaptics } from '../hooks/useHaptics';

export function MatchSetup({ onStart }) {
  const { vibrateTap } = useHaptics();
  const [overs, setOvers] = useState(20);
  const [wickets, setWickets] = useState(10);
  const [matchTitle, setMatchTitle] = useState('T20 Match');
  const [activePreset, setActivePreset] = useState('t20');

  const presets = [
    { id: 't20', title: 'T20 Match', overs: 20, wickets: 10, icon: Flame, color: 'from-amber-500 to-red-600' },
    { id: 't10', title: 'T10 Match', overs: 10, wickets: 10, icon: Trophy, color: 'from-blue-500 to-cyan-500' },
    { id: 'short', title: '5 Over Blitz', overs: 5, wickets: 5, icon: Settings2, color: 'from-purple-500 to-pink-500' },
    { id: 'odi', title: 'ODI Match', overs: 50, wickets: 10, icon: ShieldCheck, color: 'from-emerald-500 to-teal-600' },
  ];

  const handleSelectPreset = (preset) => {
    vibrateTap();
    setActivePreset(preset.id);
    setOvers(preset.overs);
    setWickets(preset.wickets);
    setMatchTitle(preset.title);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    vibrateTap();
    if (overs > 0 && wickets > 0) {
      onStart(overs, wickets, matchTitle);
    }
  };

  return (
    <div className="min-h-screen bg-umpire-dark flex flex-col justify-between p-4 sm:p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center pt-4 pb-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-500 p-3 mb-3 shadow-lg glow-accent">
          <span className="text-3xl font-black text-slate-900 tracking-tighter">UC</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-wide">UMPIRE COUNTER</h1>
        <p className="text-slate-400 text-xs mt-1 uppercase tracking-wider font-semibold">On-Field Match Configuration</p>
      </div>

      {/* Match Config Card */}
      <form onSubmit={handleSubmit} className="bg-umpire-card border border-umpire-border rounded-3xl p-5 shadow-2xl space-y-6">
        
        {/* Quick Presets */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Match Presets</label>
          <div className="grid grid-cols-2 gap-2.5">
            {presets.map((p) => {
              const Icon = p.icon;
              const isSelected = activePreset === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className={`p-3 rounded-2xl border text-left transition-all btn-tactile ${
                    isSelected
                      ? 'border-sky-400 bg-sky-950/40 ring-2 ring-sky-500/50'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold ${isSelected ? 'text-sky-300' : 'text-slate-300'}`}>
                      {p.title}
                    </span>
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-sky-400' : 'text-slate-500'}`} />
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    {p.overs} Ov • {p.wickets} Wkts
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Overs Input */}
        <div className="space-y-4 pt-2 border-t border-slate-800">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Total Overs</label>
              <span className="text-lg font-black font-mono text-sky-400">{overs} <span className="text-xs text-slate-400">OVERS</span></span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="50"
                value={overs}
                onChange={(e) => {
                  setOvers(Number(e.target.value));
                  setActivePreset('custom');
                }}
                className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
              <input
                type="number"
                min="1"
                max="100"
                value={overs}
                onChange={(e) => {
                  setOvers(Number(e.target.value));
                  setActivePreset('custom');
                }}
                className="w-16 bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-center font-mono font-bold text-white text-sm focus:border-sky-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Max Wickets Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Max Wickets</label>
              <span className="text-lg font-black font-mono text-rose-400">{wickets} <span className="text-xs text-slate-400">WKTS</span></span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="20"
                value={wickets}
                onChange={(e) => {
                  setWickets(Number(e.target.value));
                  setActivePreset('custom');
                }}
                className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <input
                type="number"
                min="1"
                max="20"
                value={wickets}
                onChange={(e) => {
                  setWickets(Number(e.target.value));
                  setActivePreset('custom');
                }}
                className="w-16 bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-center font-mono font-bold text-white text-sm focus:border-rose-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Match Name Input */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Match Label (Optional)</label>
            <input
              type="text"
              value={matchTitle}
              onChange={(e) => setMatchTitle(e.target.value)}
              placeholder="e.g. Finals / Innings 1"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 text-sm focus:border-sky-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Start Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-black py-4 px-6 rounded-2xl shadow-xl flex items-center justify-center gap-3 text-lg tracking-wide btn-tactile glow-accent"
        >
          <Play className="w-6 h-6 fill-current" />
          START MATCH ON-FIELD
        </button>
      </form>

      {/* Footer Info */}
      <div className="text-center py-4 text-xs text-slate-500 font-medium">
        Designed for High-Sunlight & Single-Thumb Operation
      </div>
    </div>
  );
}
