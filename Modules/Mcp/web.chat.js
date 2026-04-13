export function buildChatHTML({ MODEL }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Gemini Chat</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%;overflow:hidden}
  body{font-family:monospace;background:#0d0d0d;color:#ccc;display:flex;flex-direction:column}
  header{display:flex;align-items:center;justify-content:space-between;padding:.75rem 1.25rem;border-bottom:1px solid #222;flex-shrink:0}
  header h1{color:#7fba00;font-size:.95rem;letter-spacing:.05em}
  .badge{font-size:.68rem;color:#555;border:1px solid #2a2a2a;padding:.2rem .55rem;letter-spacing:.04em}
  .btn-clear{background:none;border:1px solid #333;color:#555;padding:.25rem .75rem;font:inherit;font-size:.75rem;cursor:pointer}
  .btn-clear:hover{border-color:#7fba00;color:#7fba00}
  #messages{flex:1;overflow-y:auto;padding:1rem 1.25rem;display:flex;flex-direction:column;gap:.85rem}
  .msg{max-width:80%;padding:.6rem .85rem;line-height:1.55;font-size:.83rem;white-space:pre-wrap;word-break:break-word}
  .msg.user{align-self:flex-end;background:#1a1a1a;border:1px solid #333;color:#ccc}
  .msg.assistant{align-self:flex-start;background:#141414;border:1px solid #2a2a2a;color:#bbb}
  .msg.assistant .label{font-size:.65rem;color:#7fba00;margin-bottom:.35rem;letter-spacing:.04em}
  .msg.error{align-self:flex-start;background:#1a0d0d;border:1px solid #4a1a1a;color:#e06c75}
  .cursor{display:inline-block;width:8px;height:.9em;background:#7fba00;animation:blink .8s steps(1) infinite;vertical-align:text-bottom;margin-left:2px}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  footer{border-top:1px solid #222;padding:.75rem 1.25rem;display:flex;gap:.6rem;flex-shrink:0}
  #input{flex:1;background:#0d0d0d;border:1px solid #333;color:#ccc;padding:.5rem .75rem;font:inherit;font-size:.83rem;resize:none;min-height:40px;max-height:140px;overflow-y:auto;field-sizing:content}
  #input:focus{outline:none;border-color:#7fba00}
  #send{background:#7fba00;color:#000;border:none;padding:.5rem 1.1rem;font:inherit;font-size:.83rem;cursor:pointer;align-self:flex-end;flex-shrink:0}
  #send:disabled{background:#3a5a00;color:#1a1a1a;cursor:default}
  #send:not(:disabled):hover{background:#a0d020}
  ::-webkit-scrollbar{width:6px}
  ::-webkit-scrollbar-track{background:#0d0d0d}
  ::-webkit-scrollbar-thumb{background:#2a2a2a}
  ::-webkit-scrollbar-thumb:hover{background:#7fba00}
</style>
</head>
<body>
<header>
  <h1>Gemini Chat</h1>
  <div style="display:flex;align-items:center;gap:.75rem">
    <span class="badge">${MODEL}</span>
    <button class="btn-clear" id="clear">clear</button>
  </div>
</header>
<div id="messages"></div>
<footer>
  <textarea id="input" placeholder="Message\u2026" rows="1"></textarea>
  <button id="send">Send</button>
</footer>

<script>
const MODEL = ${JSON.stringify(MODEL)};
let history = [];
let streaming = false;

const messagesEl = document.getElementById('messages');
const inputEl    = document.getElementById('input');
const sendBtn    = document.getElementById('send');

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function scrollBottom() {
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function appendMessage(role, text, id) {
  const div = document.createElement('div');
  div.className = 'msg ' + role;
  if (id) div.dataset.id = id;
  if (role === 'assistant') {
    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = MODEL;
    div.appendChild(label);
  }
  const content = document.createElement('span');
  content.className = 'content';
  content.textContent = text;
  div.appendChild(content);
  messagesEl.appendChild(div);
  scrollBottom();
  return div;
}

function setStreaming(on) {
  streaming = on;
  sendBtn.disabled = on;
  inputEl.disabled = on;
}

async function send() {
  const text = inputEl.value.trim();
  if (!text || streaming) return;
  inputEl.value = '';
  inputEl.style.height = '';

  appendMessage('user', text);
  history.push({ role: 'user', content: text });

  setStreaming(true);
  const msgDiv = appendMessage('assistant', '');
  const contentSpan = msgDiv.querySelector('.content');
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  msgDiv.appendChild(cursor);

  let accumulated = '';

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, history: history.slice(0, -1) })
    });

    if (!res.ok) {
      const err = await res.text();
      msgDiv.className = 'msg error';
      contentSpan.textContent = 'Error ' + res.status + ': ' + err;
      cursor.remove();
      setStreaming(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split('\\n');
      buf = lines.pop();
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const raw = line.slice(6).trim();
        if (!raw || raw === '[DONE]') continue;
        try {
          const json = JSON.parse(raw);
          const chunk = json.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
          if (chunk) {
            accumulated += chunk;
            contentSpan.textContent = accumulated;
            scrollBottom();
          }
        } catch (_) {}
      }
    }
  } catch (err) {
    msgDiv.className = 'msg error';
    contentSpan.textContent = 'Network error: ' + err.message;
  }

  cursor.remove();
  history.push({ role: 'model', content: accumulated });
  setStreaming(false);
  inputEl.focus();
}

sendBtn.addEventListener('click', send);

inputEl.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    send();
  }
});

document.getElementById('clear').addEventListener('click', () => {
  history = [];
  messagesEl.innerHTML = '';
  inputEl.focus();
});
</script>
</body>
</html>`;
}
