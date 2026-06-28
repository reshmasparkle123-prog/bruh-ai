import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const BADGES = [
  { id: 'first', icon: '🎯', label: 'First Send', condition: (s) => s.totalMessages >= 1 },
  { id: 'streak3', icon: '🔥', label: '3 Day Streak', condition: (s) => s.streak >= 3 },
  { id: 'learner', icon: '🧠', label: 'Big Brain', condition: (s) => s.learnMessages >= 5 },
  { id: 'practice5', icon: '💪', label: 'Grinder', condition: (s) => s.practiceMessages >= 5 },
  { id: 'interview', icon: '🎤', label: 'Interview Slay', condition: (s) => s.interviewMessages >= 3 },
  { id: 'legacy', icon: '💀', label: 'FAAAHHH Survivor', condition: (s) => s.legacyMessages >= 5 },
];

const LEADERBOARD_NORMAL = [
  { name: 'Aditya V.', score: 2840, avatar: 'AV' },
  { name: 'Priya S.', score: 2210, avatar: 'PS' },
  { name: 'Karan R.', score: 1990, avatar: 'KR' },
  { name: 'Sneha M.', score: 1750, avatar: 'SM' },
];

const LEADERBOARD_LEGACY = [
  { name: 'Aditya V.', score: 18, avatar: 'AV' },
  { name: 'Rush F.', score: 14, avatar: 'RF' },
  { name: 'Karan R.', score: 11, avatar: 'KR' },
  { name: 'Sneha M.', score: 8, avatar: 'SM' },
];

const HEATMAP = [
  'l2','l1','l3','l2','l1','','',
  'l1','l2','l3','l3','l2','l1','',
  '','l1','l2','l3','l3','l2','l1',
  'l1','l2','l3','l3','today','',''
];

function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (type === 'send') {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = 600; o.type = 'sine';
      g.gain.setValueAtTime(0.1, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      o.start(); o.stop(ctx.currentTime + 0.1);
    } else if (type === 'whip') {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(1200, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.3);
      g.gain.setValueAtTime(0.5, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      o.start(); o.stop(ctx.currentTime + 0.35);
    } else if (type === 'faahh') {
      [300, 250, 200, 150, 100].forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'sawtooth';
        o.frequency.value = f;
        g.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.05 + 0.15);
        o.start(ctx.currentTime + i * 0.05);
        o.stop(ctx.currentTime + i * 0.05 + 0.15);
      });
    } else if (type === 'slay') {
      [523, 659, 784, 1046].forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = f; o.type = 'sine';
        g.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.15);
        o.start(ctx.currentTime + i * 0.1);
        o.stop(ctx.currentTime + i * 0.1 + 0.15);
      });
    }
  } catch (e) {}
}

export default function App() {
  const [mode, setMode] = useState('learn');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { who: 'bruh', text: 'yooo bestie! 👾 welcome to BRUH — your gen z ai bestie.\n\npick a mode and lets get it fr fr:\n🧠 learn — concepts explained like a bestie\n💪 practice — MCQs with FAAAHHH if wrong\n🎤 interview — mock interviews no filter\n💀 faaahhh legacy — if you dare 😭' }
  ]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalMessages: 0, streak: 4,
    learnMessages: 0, practiceMessages: 0,
    interviewMessages: 0, legacyMessages: 0,
    score: 0, legacyScore: 0
  });
  const [showLB, setShowLB] = useState(false);
  const [whipActive, setWhipActive] = useState(false);
  const [shaking, setShaking] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const earned = BADGES.filter(b => b.condition(stats));
  const lb = mode === 'legacy' ? LEADERBOARD_LEGACY : LEADERBOARD_NORMAL;
  const ranks = ['gold', 'silver', 'bronze', 'top'];

  const triggerWhip = (fromUser = true) => {
    playSound('whip');
    setWhipActive(true);
    setShaking(true);
    setTimeout(() => { setWhipActive(false); setShaking(false); }, 500);
    if (fromUser) {
      setMessages(prev => [...prev, {
        who: 'bruh',
        text: mode === 'legacy'
          ? 'FAAAHHH 💀 BESTIE THE WHIP— okay okay I\'M COMING 😭 chill fr'
          : 'okay okay 😭 *whip crackles* main yahan hoon bestie, kya chahiye?',
        legacy: mode === 'legacy'
      }]);
    }
  };
const sendMessage = async (text) => {
  // Unlock audio on first interaction
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    await ctx.resume();
  } catch(e) {}
  
  const msg = text || input;
  const sendMessage = async (text) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;
    setInput('');
    playSound('send');

    setMessages(prev => [...prev, { who: 'user', text: msg }]);
    setLoading(true);

    setStats(prev => ({
      ...prev,
      totalMessages: prev.totalMessages + 1,
      [`${mode}Messages`]: (prev[`${mode}Messages`] || 0) + 1,
      score: prev.score + 10,
      legacyScore: mode === 'legacy' ? prev.legacyScore + 15 : prev.legacyScore
    }));

    try {
      const res = await axios.post('https://bruh-ai-production.up.railway.app/api/chat', {
        message: msg,
        mode,
        systemExtra: mode === 'legacy'
          ? ' FAAAHHH LEGACY MODE: be extra brutal and savage. scream FAAAHHH for wrong answers. use 💀 everywhere. roast hard but still teach.'
          : ' Give detailed, thorough explanations. Cover the concept fully with examples, time complexity, use cases. Be genuinely helpful while staying Gen Z.'
      });

      const reply = res.data.reply;
const isWrong = reply.toLowerCase().includes('wrong') ||
  reply.toLowerCase().includes('incorrect') ||
  reply.toLowerCase().includes('nahi') ||
  reply.toLowerCase().includes('faaahhh') ||
  reply.toLowerCase().includes('galat') ||
  reply.toLowerCase().includes('sorry');

// Always play sound on response
if (mode === 'legacy') {
  playSound('faahh');
} else {
  playSound('slay');
}

      if (isWrong && mode === 'legacy') {
        playSound('faahh');
        triggerWhip(false);
      } else if (!isWrong) {
        playSound('slay');
      }

      setMessages(prev => [...prev, {
        who: 'bruh',
        text: reply,
        legacy: mode === 'legacy'
      }]);
    } catch {
      triggerWhip(false);
      setMessages(prev => [...prev, {
        who: 'bruh',
        text: mode === 'legacy'
          ? 'FAAAHHH 💀 server ne bhi give up kar diya — try again bestie'
          : 'bruh server broke 😭 try again bestie',
        legacy: mode === 'legacy'
      }]);
    }
    setLoading(false);
  };

  const switchMode = (m) => {
    setMode(m);
    const intros = {
      learn: 'learn mode activated 🧠 kya concept samjhna hai? no cap main full detail mein explain karunga fr fr',
      practice: 'practice mode 💪 ready ho? MCQs aayenge — FAAAHHH bhi aayega agar wrong gaya 😭',
      interview: 'interview mode 🎤 chal shuru karte hain. tell me about yourself — and make it actually interesting bestie',
      legacy: 'FAAAHHH LEGACY MODE ACTIVATED 💀💀💀\n\nbestie... are you sure?? no mercy from here.\nwrong answer = FAAAHHH sound + roast\nright answer = slay moment\n\nask me ANYTHING. i dare you. 😈'
    };
    setMessages([{ who: 'bruh', text: intros[m], legacy: m === 'legacy' }]);
  };

  return (
    <div className={`bruh-app ${shaking ? 'shake' : ''}`}>
      <div className={`whip-overlay ${whipActive ? 'active' : ''}`} />

      <div className="bruh-header">
        <div className="bruh-logo">BR<span>U</span>H</div>
        <div className="bruh-tagline">your ai bestie • no cap • just help 💀</div>
      </div>

      <div className="stats-hud">
        <div className="hud-card">
          <div className="hud-num">{stats.score}</div>
          <div className="hud-label">XP</div>
        </div>
        <div className="hud-card">
          <div className="hud-num">{stats.streak}</div>
          <div className="hud-label">Streak</div>
        </div>
        <div className="hud-card">
          <div className="hud-num">{stats.totalMessages}</div>
          <div className="hud-label">Msgs</div>
        </div>
        <div className="hud-card">
          <div className="hud-num">{earned.length}</div>
          <div className="hud-label">Badges</div>
        </div>
      </div>

      <div className="streak-section">
        <div className="streak-top">
          <span className="streak-title">🔥 activity streak</span>
          <span className="streak-count">{stats.streak} days</span>
        </div>
        <div className="heatmap">
          {HEATMAP.map((c, i) => (
            <div key={i} className={`heat-cell ${c}`} />
          ))}
        </div>
      </div>

      <div className="mode-tabs">
        {[
          { id: 'learn', label: '🧠 learn' },
          { id: 'practice', label: '💪 practice' },
          { id: 'interview', label: '🎤 interview' },
          { id: 'legacy', label: '💀 faaahhh' },
        ].map(m => (
          <button key={m.id}
            className={`mode-tab ${m.id === 'legacy' ? 'legacy' : ''} ${mode === m.id ? 'active' : ''}`}
            onClick={() => switchMode(m.id)}>
            {m.label}
          </button>
        ))}
      </div>

      {mode === 'legacy' && (
        <div className="legacy-banner">
          💀 FAAAHHH LEGACY — no mercy zone • pure roast • actual learning 💀
        </div>
      )}

      <div className="chat-area" ref={chatRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.who === 'user' ? 'msg-user' : ''}`}>
            <div className={`avatar ${msg.who === 'user' ? 'avatar-user' : msg.legacy ? 'avatar-legacy' : 'avatar-bruh'}`}>
              {msg.who === 'user' ? 'U' : msg.legacy ? '💀' : 'B'}
            </div>
            <div className={`bubble ${msg.who === 'user' ? 'bubble-user' : msg.legacy ? 'bubble-legacy' : 'bubble-bruh'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="msg">
            <div className={`avatar ${mode === 'legacy' ? 'avatar-legacy' : 'avatar-bruh'}`}>
              {mode === 'legacy' ? '💀' : 'B'}
            </div>
            <div className="typing">
              {mode === 'legacy' ? '💀 cooking your roast...' : '⚡ BRUH is typing fr fr...'}
            </div>
          </div>
        )}
      </div>

      <div className="input-area">
        <button className="whip-btn" onClick={() => triggerWhip(true)} title="whip it!">
          🎵
        </button>
        <input className="bruh-input" value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder={mode === 'legacy' ? 'dare to answer... 💀' : 'kuch bhi poocho bestie...'}
        />
        <button className="send-btn" onClick={() => sendMessage()}>→</button>
      </div>

      <div className="badges-section" style={{ marginTop: 10 }}>
        <div className="section-header">
          <span className="section-title">badges</span>
          <span className="section-count">{earned.length}/{BADGES.length} earned</span>
        </div>
        <div className="badges-grid">
          {BADGES.map(b => {
            const isEarned = earned.find(e => e.id === b.id);
            return (
              <div key={b.id} className={`badge ${isEarned ? (b.id === 'legacy' ? 'legacy-earned' : 'earned') : ''}`}>
                <span className="badge-icon">{b.icon}</span>
                <span className="badge-name">{b.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="diva-card">
        <div className="diva-title">👑 diva of the week</div>
        <div className="diva-name">Aditya V.</div>
        <div className="diva-countdown">next reveal in 5 days • faaahhh legacy champion</div>
      </div>

      <div className="leaderboard" style={{ marginTop: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div className="lb-title">
            {mode === 'legacy' ? '💀 faaahhh legacy board' : '🏆 leaderboard'}
          </div>
          <button onClick={() => setShowLB(!showLB)}
            style={{ background: 'transparent', border: 'none', color: '#7F77DD', fontSize: 11, cursor: 'pointer' }}>
            {showLB ? 'hide' : 'show'}
          </button>
        </div>
        {showLB && (
          <>
            {lb.map((p, i) => (
              <div key={i} className="lb-row">
                <div className={`lb-rank ${ranks[i]}`}>{i + 1}</div>
                <div className="lb-avatar">{p.avatar}</div>
                <div className="lb-name">{p.name}</div>
                <div className={`lb-score ${mode === 'legacy' ? 'legacy' : ''}`}>{p.score}</div>
              </div>
            ))}
            <div className={`lb-row ${mode === 'legacy' ? 'legacy-you' : 'you'}`}>
              <div className="lb-rank top">5</div>
              <div className="lb-avatar">You</div>
              <div className="lb-name">You 👈</div>
              <div className={`lb-score ${mode === 'legacy' ? 'legacy' : ''}`}>
                {mode === 'legacy' ? stats.legacyScore : stats.score}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}