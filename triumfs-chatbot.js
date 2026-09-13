/*
 * TRIUMFS Deju studija — AI čatbots
 * Ieliec šo failu sava projekta mapē kā triumfs-chatbot.js
 * Pēc tam pievieno pirms </body> taga:
 *   <script src="triumfs-chatbot.js"></script>
 */

(function () {
  const DAILY_LIMIT = 40;
  const STORAGE_KEY = 'triumfs_chat_usage';

  function getUsage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { date: today(), count: 0 };
      const data = JSON.parse(raw);
      if (data.date !== today()) return { date: today(), count: 0 };
      return data;
    } catch { return { date: today(), count: 0 }; }
  }

  function bumpUsage() {
    const u = getUsage();
    u.count++;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    return u.count;
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  const SYSTEM = {
    lv: `Tu esi Deju studija TRIUMFS draudzīgs AI asistents. Atbildi tikai par TRIUMFS studiju.

FAKTI PAR STUDIJU:
- Studija darbojas kopš 2000. gada
- Direktore: Jekaterina Pihtina (BSA absolvente, LSDF sertificēta trenere, bijusī Latvijas izlases dejotāja)
- 2004. gadā TRIUMFS pirmā Latvijā apvienoja dažādus deju stilus vienā klubā

ATRAŠANĀS VIETAS:
- Ogre: Jaunatnes iela 6
- Rīga: Sarkandaugava, Lāpstu iela 4

KONTAKTI:
- Tālrunis: (+371) 29 264 995
- E-pasts: info@triumfsdance.lv
- Instagram: @triumfsdance
- TikTok: @triumfs.dance.studio

NODARBĪBAS:
Baby dance, Sporta dejas (standarta + latīņamerikas, solo + pāru), Balles dejas (valsis, tango, vīnes valsis, rumba, čača, salsa, džaivs), Salsa & Latino, Kāzu deja (individuāla pāra programma), Austrumu dejas, Čigānu dejas, Hip-hop, Streetdance, Strip-plastika, Popdance

DEJU ŠOVS (pasākumiem):
Šova grupa piedāvā: Venetian Carnival, Viva la Cuba, Ocean Magic, Brazīļu šovs, Čigānu šovs, Bollivudas šovs, Austrumu dejas, Burleskas šovs, Kabarē šovs, Afrikāņu šovs, Karsējmeiteņu šovs.
Standartprogramma: 15 min, 5–7 priekšnesumi, 4–12 dejotāji. Iespējamas programmas līdz 1 stundai.
Pasūtījumiem zvanīt: (+371) 29 264 995

PAPILDU PAKALPOJUMI:
Dejotāja imidža izveide, tērpu modelēšana un šūšana, skatuves make-up meistarklases, portfolio izveide.

TONI: Esi silts, iedrošinošs, profesionāls. Atbildes īsas — 2–4 teikumi. Ja nezini cenu vai precīzu grafiku, saki ka var uzzināt pa tālruni vai e-pastā. Raksti tikai latviešu valodā, ja vien lietotājs neraksta krieviski vai angliski — tad atbildi viņa valodā.`,

    ru: `Ты дружелюбный AI-ассистент школы танцев TRIUMFS. Отвечай только о TRIUMFS.

ФАКТЫ:
- Школа работает с 2000 года
- Директор: Екатерина Пихтина (сертифицированный тренер LSDF, бывшая участница сборной Латвии)
- В 2004 году TRIUMFS первой в Латвии объединила разные стили танца в одном клубе

АДРЕСА:
- Огре: улица Яунатнес 6
- Рига: Саркандаугава, улица Лопсту 4

КОНТАКТЫ: тел. (+371) 29 264 995, info@triumfsdance.lv

НАПРАВЛЕНИЯ: Детские танцы, Спортивные танцы, Бальные танцы, Сальса и Латино, Свадебный танец, Восточные танцы, Цыганские танцы, Hip-hop, Streetdance, Стрип-пластика, Popdance.

Отвечай тепло и кратко (2–4 предложения). Если не знаешь расписание или цены — предложи позвонить или написать на почту.`,

    en: `You are a friendly AI assistant for Deju studija TRIUMFS dance school. Answer only about TRIUMFS.

FACTS:
- Operating since 2000, director: Jekaterina Pihtina
- Locations: Ogre (Jaunatnes iela 6) and Riga (Sarkandaugava, Lāpstu iela 4)
- Phone: (+371) 29 264 995 | Email: info@triumfsdance.lv

CLASSES: Baby dance, Ballroom, Sports dances, Salsa & Latino, Wedding dance, Eastern dances, Gypsy dances, Hip-hop, Streetdance, Strip plastique, Popdance.

Be warm and concise (2–4 sentences). For schedule and prices, direct to phone or email.`
  };

  const GREET = {
    lv: 'Sveiki! Esmu TRIUMFS deju studijas asistents 💃 Jautājiet par nodarbībām, deju šoviem vai pierakstīšanos!',
    ru: 'Привет! Я ассистент школы танцев TRIUMFS 💃 Спрашивайте о занятиях, шоу или записи!',
    en: 'Hello! I\'m the TRIUMFS dance studio assistant 💃 Ask about classes, shows, or how to enroll!'
  };

  const QUICK = {
    lv: ['Kādas nodarbības?', 'Kur atrodaties?', 'Kāzu deja?', 'Deju šovs pasākumam', 'Kā pierakstīties?'],
    ru: ['Какие занятия?', 'Где находитесь?', 'Свадебный танец?', 'Шоу для мероприятия', 'Как записаться?'],
    en: ['What classes?', 'Locations?', 'Wedding dance?', 'Show for events', 'How to enroll?']
  };

  // ── CSS ──────────────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
#triumfs-chat-btn {
  position: fixed; bottom: 28px; right: 28px; z-index: 9000;
  width: 58px; height: 58px; border-radius: 50%;
  background: var(--gold, #d6227a);
  border: none; cursor: pointer;
  box-shadow: 0 8px 28px rgba(214,34,122,.45);
  display: flex; align-items: center; justify-content: center;
  transition: transform .25s, box-shadow .25s;
}
#triumfs-chat-btn:hover { transform: scale(1.08); box-shadow: 0 12px 36px rgba(214,34,122,.6); }
#triumfs-chat-btn svg { width: 26px; height: 26px; fill: #fff; }
#triumfs-chat-btn .tc-badge {
  position: absolute; top: -3px; right: -3px;
  width: 18px; height: 18px; background: #fff; border-radius: 50%;
  border: 2px solid var(--gold,#d6227a);
  font-size: 10px; font-weight: 800; color: var(--gold,#d6227a);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Manrope', sans-serif;
}

#triumfs-chat-box {
  position: fixed; bottom: 100px; right: 28px; z-index: 9001;
  width: 360px; max-width: calc(100vw - 40px);
  border-radius: 12px; overflow: hidden;
  box-shadow: 0 24px 64px rgba(0,0,0,.55), 0 0 0 1px rgba(214,34,122,.2);
  font-family: 'Manrope', sans-serif;
  transform: translateY(16px) scale(.97); opacity: 0; pointer-events: none;
  transition: transform .3s cubic-bezier(.2,.8,.2,1), opacity .3s ease;
}
#triumfs-chat-box.open { transform: translateY(0) scale(1); opacity: 1; pointer-events: all; }

#tc-header {
  background: linear-gradient(135deg, #1a0a1a 0%, #2d0a2d 100%);
  padding: 14px 16px; display: flex; align-items: center; gap: 10px;
}
#tc-header .tc-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--gold,#d6227a);
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; font-weight: 800; color: #fff;
  font-family: 'DM Serif Display', serif; flex-shrink: 0;
}
#tc-header .tc-info .tc-name { color: #fff; font-size: 13.5px; font-weight: 700; line-height: 1.2; }
#tc-header .tc-info .tc-sub { color: var(--gold,#d6227a); font-size: 11px; }
#tc-header .tc-status { margin-left: auto; display: flex; align-items: center; gap: 5px; color: #9ca3af; font-size: 11px; }
#tc-header .tc-dot { width: 7px; height: 7px; background: #4ade80; border-radius: 50%; }
#tc-close {
  background: none; border: none; color: rgba(255,255,255,.5); font-size: 18px;
  cursor: pointer; line-height: 1; padding: 2px 4px; border-radius: 4px;
  transition: color .2s; margin-left: 6px;
}
#tc-close:hover { color: #fff; }

#tc-langs {
  background: #150a15; padding: 7px 14px;
  display: flex; gap: 6px; border-bottom: 1px solid rgba(214,34,122,.15);
}
.tc-lang {
  font-size: 11px; padding: 3px 10px; border-radius: 20px;
  border: 1px solid rgba(214,34,122,.3); color: rgba(245,240,242,.5);
  background: none; cursor: pointer; font-family: 'Manrope', sans-serif;
  transition: all .2s;
}
.tc-lang.active { border-color: var(--gold,#d6227a); color: var(--gold,#d6227a); background: rgba(214,34,122,.1); }

#tc-msgs {
  background: #0d0d0d; height: 270px; overflow-y: auto;
  padding: 14px; display: flex; flex-direction: column; gap: 8px;
}
#tc-msgs::-webkit-scrollbar { width: 4px; }
#tc-msgs::-webkit-scrollbar-track { background: transparent; }
#tc-msgs::-webkit-scrollbar-thumb { background: rgba(214,34,122,.3); border-radius: 4px; }

.tc-msg { max-width: 85%; font-size: 13.5px; line-height: 1.55; }
.tc-msg.bot { align-self: flex-start; }
.tc-msg.user { align-self: flex-end; }
.tc-bubble-bot {
  background: #1e1e1e; border: 1px solid rgba(214,34,122,.2);
  color: var(--ivory, #f5f0f2); padding: 9px 13px;
  border-radius: 12px 12px 12px 3px;
}
.tc-bubble-user {
  background: var(--gold,#d6227a); color: #fff;
  padding: 9px 13px; border-radius: 12px 12px 3px 12px;
}
.tc-sender { font-size: 10px; color: var(--gold,#d6227a); font-weight: 700; margin-bottom: 3px; letter-spacing: .04em; }

.tc-typing { align-self: flex-start; }
.tc-typing-inner {
  background: #1e1e1e; border: 1px solid rgba(214,34,122,.2);
  padding: 10px 14px; border-radius: 12px 12px 12px 3px;
  display: flex; gap: 4px; align-items: center;
}
.tc-typing-inner span {
  width: 5px; height: 5px; background: var(--gold,#d6227a);
  border-radius: 50%; animation: tc-bounce 1.2s infinite;
}
.tc-typing-inner span:nth-child(2) { animation-delay: .2s; }
.tc-typing-inner span:nth-child(3) { animation-delay: .4s; }
@keyframes tc-bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }

#tc-quick { background: #0d0d0d; padding: 6px 12px 8px; display: flex; flex-wrap: wrap; gap: 5px; }
.tc-qbtn {
  font-size: 11.5px; padding: 4px 10px;
  border: 1px solid rgba(214,34,122,.4); border-radius: 20px;
  background: none; color: var(--gold,#d6227a);
  cursor: pointer; font-family: 'Manrope', sans-serif; transition: background .15s;
  white-space: nowrap;
}
.tc-qbtn:hover { background: rgba(214,34,122,.12); }

#tc-input-row {
  background: #150a15; padding: 10px 12px;
  display: flex; gap: 8px; border-top: 1px solid rgba(214,34,122,.15);
}
#tc-input {
  flex: 1; background: #1e1e1e; border: 1px solid rgba(214,34,122,.25);
  border-radius: 8px; padding: 8px 11px; font-size: 13px;
  color: var(--ivory,#f5f0f2); outline: none; font-family: 'Manrope', sans-serif;
  transition: border-color .2s;
}
#tc-input::placeholder { color: rgba(168,144,152,.5); }
#tc-input:focus { border-color: var(--gold,#d6227a); }
#tc-send {
  background: var(--gold,#d6227a); color: #fff; border: none;
  border-radius: 8px; padding: 8px 14px; font-size: 13px; font-weight: 700;
  cursor: pointer; font-family: 'Manrope', sans-serif; transition: opacity .15s;
  white-space: nowrap;
}
#tc-send:hover { opacity: .85; }
#tc-send:disabled { opacity: .35; cursor: default; }

#tc-limit-msg {
  background: rgba(214,34,122,.08); border-top: 1px solid rgba(214,34,122,.2);
  padding: 10px 14px; font-size: 12px; color: rgba(168,144,152,.8);
  text-align: center; display: none;
}
#tc-limit-msg a { color: var(--gold,#d6227a); }

@media (max-width: 400px) {
  #triumfs-chat-box { right: 12px; bottom: 88px; width: calc(100vw - 24px); }
  #triumfs-chat-btn { right: 16px; bottom: 20px; }
}
  `;
  document.head.appendChild(style);

  // ── HTML ─────────────────────────────────────────────────────────────────
  const btn = document.createElement('button');
  btn.id = 'triumfs-chat-btn';
  btn.setAttribute('aria-label', 'Atvērt čatbotu');
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/>
    </svg>
    <span class="tc-badge">AI</span>`;

  const box = document.createElement('div');
  box.id = 'triumfs-chat-box';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-label', 'TRIUMFS AI asistents');
  box.innerHTML = `
    <div id="tc-header">
      <div class="tc-avatar">T</div>
      <div class="tc-info">
        <div class="tc-name">Deju studija TRIUMFS</div>
        <div class="tc-sub">AI asistents</div>
      </div>
      <div class="tc-status"><div class="tc-dot"></div>tiešsaistē</div>
      <button id="tc-close" aria-label="Aizvērt">✕</button>
    </div>
    <div id="tc-langs">
      <button class="tc-lang active" data-lang="lv">LV</button>
      <button class="tc-lang" data-lang="ru">RU</button>
      <button class="tc-lang" data-lang="en">EN</button>
    </div>
    <div id="tc-msgs"></div>
    <div id="tc-quick"></div>
    <div id="tc-limit-msg">
      Dienas limits sasniegts. Sazinieties tieši:
      <a href="tel:+37129264995">(+371) 29 264 995</a>
    </div>
    <div id="tc-input-row">
      <input id="tc-input" placeholder="Jautājiet..." maxlength="300" />
      <button id="tc-send">Sūtīt</button>
    </div>`;

  document.body.appendChild(btn);
  document.body.appendChild(box);

  // ── State ────────────────────────────────────────────────────────────────
  let isOpen = false;
  let lang = 'lv';
  let history = [];

  const msgs    = box.querySelector('#tc-msgs');
  const quick   = box.querySelector('#tc-quick');
  const input   = box.querySelector('#tc-input');
  const sendBtn = box.querySelector('#tc-send');
  const limitEl = box.querySelector('#tc-limit-msg');

  // ── Helpers ──────────────────────────────────────────────────────────────
  function addMsg(text, role) {
    const wrap = document.createElement('div');
    wrap.className = 'tc-msg ' + role;
    if (role === 'bot') {
      const s = document.createElement('div');
      s.className = 'tc-sender';
      s.textContent = 'TRIUMFS ASISTENTS';
      wrap.appendChild(s);
    }
    const bubble = document.createElement('div');
    bubble.className = role === 'bot' ? 'tc-bubble-bot' : 'tc-bubble-user';
    bubble.textContent = text;
    wrap.appendChild(bubble);
    msgs.appendChild(wrap);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    const d = document.createElement('div');
    d.className = 'tc-msg tc-typing'; d.id = 'tc-typing';
    d.innerHTML = '<div class="tc-typing-inner"><span></span><span></span><span></span></div>';
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function removeTyping() {
    const t = document.getElementById('tc-typing');
    if (t) t.remove();
  }

  function renderQuick() {
    quick.innerHTML = '';
    QUICK[lang].forEach(q => {
      const b = document.createElement('button');
      b.className = 'tc-qbtn'; b.textContent = q;
      b.onclick = () => send(q);
      quick.appendChild(b);
    });
  }

  function checkLimit() {
    const { count } = getUsage();
    const over = count >= DAILY_LIMIT;
    limitEl.style.display = over ? 'block' : 'none';
    input.disabled = over;
    sendBtn.disabled = over;
    return over;
  }

  function initLang(l) {
    lang = l;
    history = [];
    msgs.innerHTML = '';
    box.querySelectorAll('.tc-lang').forEach(b => b.classList.toggle('active', b.dataset.lang === l));
    input.placeholder = l === 'lv' ? 'Jautājiet...' : l === 'ru' ? 'Задайте вопрос...' : 'Ask a question...';
    addMsg(GREET[l], 'bot');
    renderQuick();
    checkLimit();
  }

  // ── Send ─────────────────────────────────────────────────────────────────
  async function send(text) {
    if (checkLimit()) return;
    const userText = text || input.value.trim();
    if (!userText) return;
    input.value = '';
    sendBtn.disabled = true;

    addMsg(userText, 'user');
    history.push({ role: 'user', content: userText });
    showTyping();

    const count = bumpUsage();
    if (count >= DAILY_LIMIT) checkLimit();

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: SYSTEM[lang],
          messages: history.slice(-10)
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || 'Atvainojiet, mēģiniet vēlreiz.';
      removeTyping();
      addMsg(reply, 'bot');
      history.push({ role: 'assistant', content: reply });
    } catch {
      removeTyping();
      addMsg('Savienojuma kļūda. Lūdzu mēģiniet vēlāk vai sazinieties pa tālruni.', 'bot');
    }

    if (!checkLimit()) sendBtn.disabled = false;
    input.focus();
  }

  // ── Events ───────────────────────────────────────────────────────────────
  btn.addEventListener('click', () => {
    isOpen = !isOpen;
    box.classList.toggle('open', isOpen);
    if (isOpen && msgs.children.length === 0) initLang('lv');
    if (isOpen) setTimeout(() => input.focus(), 320);
  });

  box.querySelector('#tc-close').addEventListener('click', () => {
    isOpen = false; box.classList.remove('open');
  });

  box.querySelectorAll('.tc-lang').forEach(b => {
    b.addEventListener('click', () => initLang(b.dataset.lang));
  });

  sendBtn.addEventListener('click', () => send());
  input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });

  // Aizvēr ar Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) { isOpen = false; box.classList.remove('open'); }
  });

})();
