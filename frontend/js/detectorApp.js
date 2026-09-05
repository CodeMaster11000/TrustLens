document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('detector-form');
  const textarea = document.getElementById('job-input');
  const analyzeButton = document.getElementById('analyze-button');
  const clearButton = document.getElementById('clear-button');
  const sampleButton = document.getElementById('sample-button');
  const contentBlock = document.getElementById('detector-result');
  const scoreValue = document.getElementById('risk-score');
  const scoreLabel = document.getElementById('risk-label');
  const summaryText = document.getElementById('result-summary');
  const flagList = document.getElementById('flag-list');
  const recommendationList = document.getElementById('recommendation-list');
  const statusPill = document.getElementById('status-pill');
  const emptyState = document.getElementById('empty-state');

  const setResult = (result) => {
    if (!contentBlock) {
      return;
    }

    const scoreColor = result.score >= 75 ? 'text-red-400' : result.score >= 40 ? 'text-amber-400' : 'text-emerald-400';
    const pillColor = result.riskLevel === 'High risk'
      ? 'border-red-700 bg-red-950/60 text-red-300'
      : result.riskLevel === 'Medium risk'
        ? 'border-amber-700 bg-amber-950/60 text-amber-300'
        : 'border-emerald-700 bg-emerald-950/60 text-emerald-300';

    scoreValue.textContent = `${result.score}%`;
    scoreValue.className = `text-5xl font-extrabold ${scoreColor}`;
    scoreLabel.textContent = result.riskLevel;
    scoreLabel.className = `text-sm font-medium ${scoreColor}`;
    summaryText.textContent = result.summary;
    statusPill.className = `rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${pillColor}`;
    statusPill.textContent = result.riskLevel;

    flagList.innerHTML = '';
    result.flags.length
      ? result.flags.forEach((flag) => {
          const item = document.createElement('li');
          item.className = 'rounded-xl border border-neutral-800 bg-neutral-950/50 px-3 py-2 text-sm text-neutral-300';
          item.textContent = flag;
          flagList.appendChild(item);
        })
      : flagList.innerHTML = '<li class="rounded-xl border border-neutral-800 bg-neutral-950/50 px-3 py-2 text-sm text-neutral-300">No obvious scam markers found.</li>';

    recommendationList.innerHTML = '';
    result.recommendations.forEach((itemText) => {
      const item = document.createElement('li');
      item.className = 'flex gap-3 rounded-xl border border-neutral-800 bg-neutral-950/50 p-3 text-sm text-neutral-300';
      item.innerHTML = '<span class="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-red-500"></span><span>' + itemText + '</span>';
      recommendationList.appendChild(item);
    });

    contentBlock.classList.remove('hidden');
    emptyState.classList.add('hidden');
  };

  const runAnalysis = () => {
    if (!textarea || !contentBlock) {
      return;
    }

    const result = window.analyzeJobText ? window.analyzeJobText(textarea.value) : { score: 0, riskLevel: 'No input', flags: [], summary: 'Unable to analyze this input right now.', recommendations: ['Try again in a moment.'] };
    setResult(result);
  };

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      runAnalysis();
    });
  }

  if (analyzeButton) {
    analyzeButton.addEventListener('click', runAnalysis);
  }

  if (clearButton) {
    clearButton.addEventListener('click', () => {
      if (textarea) {
        textarea.value = '';
      }
      if (contentBlock) {
        contentBlock.classList.add('hidden');
      }
      if (emptyState) {
        emptyState.classList.remove('hidden');
      }
      if (textarea) {
        textarea.focus();
      }
    });
  }

  if (sampleButton) {
    sampleButton.addEventListener('click', () => {
      if (textarea) {
        textarea.value = 'URGENT HIRING! We need someone immediately. No interview required. Please pay for equipment using a wire transfer and send your details via WhatsApp.';
      }
      runAnalysis();
    });
  }
});
