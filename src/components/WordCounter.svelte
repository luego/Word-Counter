<script>
  // --- Accessibility & UX ---
  let text = "";
  let copySuccess = false;
  let showSpaces = true; // Toggle for character count with/without spaces
  const CHAR_LIMIT = 10000;
  let debounceTimer;

  // --- Utility regexes ---
  // Improved sentence detection regex
  const SENTENCE_REGEX = /[^.!?\s][^.!?]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s|$)/g;
  const PARAGRAPH_REGEX = /(?:[^\r\n][\r\n]?)+/g;

  // --- Debounced text processing ---
  function debounceTextProcessing() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      // Trigger reactive updates
      text = text;
    }, 150);
  }

  // --- Trim text and collapse multiple whitespace to a single space ---
  function trimText() {
    text = text.replace(/\s+/g, " ").trim();
  }

  // --- Copy text to clipboard ---
  async function copyText() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      copySuccess = true;
      setTimeout(() => (copySuccess = false), 1500);
    } catch (e) {
      console.error('Failed to copy text:', e);
      copySuccess = false;
    }
  }

  // --- Clear text ---
  function clearText() {
    text = "";
  }

  // --- Calculate stats with debouncing ---
  $: {
    if (text.length > 1000) {
      debounceTextProcessing();
    }
  }

  $: wordCount = text.trim().length ? text.trim().split(/\s+/).length : 0;
  $: charCount = text.length;
  $: charCountNoSpaces = text.replace(/\s/g, '').length;
  $: sentenceCount = text.trim().length ? (text.match(SENTENCE_REGEX) || []).length : 0;
  $: paragraphCount = text.trim().length ? (text.match(PARAGRAPH_REGEX) || []).filter(p => p.trim().length > 0).length : 0;
  $: uniqueWords = text.trim().length ? new Set(text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 0)).size : 0;
  $: avgWordLength = wordCount > 0 ? Math.round((charCountNoSpaces / wordCount) * 10) / 10 : 0;

  // --- Reading time (average 200 words/min) ---
  $: readingTime = wordCount > 0 ? Math.ceil((wordCount / 200) * 60) : 0; // in seconds

  // --- Format reading time as mm:ss ---
  function formatReadingTime(sec) {
    if (sec < 60) return `${sec} sec`;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m} min${m > 1 ? "s" : ""}${s > 0 ? ` ${s} sec` : ""}`;
  }

  // --- Character limit warning ---
  $: charLimitExceeded = charCount > CHAR_LIMIT;

  // --- Generate export filename ---
  $: exportFilename = `word-count-${new Date().toISOString().split('T')[0]}`;
</script>

<div class="bg-white rounded-2xl shadow-lg p-6 mb-8 transition-colors">
  <div class="flex flex-wrap justify-between items-center mb-4 gap-2">
    <div class="flex items-center gap-2">
      <label class="inline-flex items-center gap-2 text-sm text-gray-700">
        <input 
          type="checkbox" 
          bind:checked={showSpaces} 
          class="rounded text-blue-700"
        />
        Include spaces in character count
      </label>
    </div>
    <div class="flex gap-2">
      <button
        type="button"
        class="px-3 py-1 rounded-lg border text-sm font-semibold transition border-gray-300 bg-gray-100 text-gray-700 hover:bg-blue-100"
        on:click={trimText}
        aria-label="Trim whitespace"
      >
        Trim Whitespace
      </button>
      <button
        type="button"
        class="px-3 py-1 rounded-lg border text-sm font-semibold transition border-gray-300 bg-gray-100 text-gray-700 hover:bg-blue-100 disabled:opacity-50"
        on:click={copyText}
        aria-label="Copy text"
        disabled={!text}
      >
        {#if copySuccess}
          Copied!
        {:else}
          Copy
        {/if}
      </button>
      <button
        type="button"
        class="px-3 py-1 rounded-lg border text-sm font-semibold transition border-gray-300 bg-gray-100 text-gray-700 hover:bg-red-100 disabled:opacity-50"
        on:click={clearText}
        aria-label="Clear text"
        disabled={!text}
      >
        Clear
      </button>
    </div>
  </div>
  
  <textarea
    class="w-full border border-gray-300 rounded-lg px-4 py-3 font-mono text-base md:text-lg lg:text-xl bg-white text-gray-900 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    rows="8"
    bind:value={text}
    placeholder="Paste or type your text here..."
    aria-label="Text to analyze"
    aria-describedby="counter-stats {charLimitExceeded ? 'char-limit-warning' : ''}"
    maxlength={CHAR_LIMIT}
  ></textarea>
  
  {#if charLimitExceeded}
    <div id="char-limit-warning" class="text-red-600 text-sm mt-1">Character limit exceeded ({CHAR_LIMIT} max).</div>
  {/if}
  
  <div
    id="counter-stats"
    class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4 text-base font-medium text-gray-700 border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm"
  >
    <div class="text-center">
      <span class="text-xl text-blue-700 font-bold block">{wordCount}</span>
      <span class="text-sm">Words</span>
    </div>
    <div class="text-center">
      <span class="text-xl text-blue-700 font-bold block">{showSpaces ? charCount : charCountNoSpaces}</span>
      <span class="text-sm">Characters {showSpaces ? '' : '(no spaces)'}</span>
    </div>
    <div class="text-center">
      <span class="text-xl text-blue-700 font-bold block">{sentenceCount}</span>
      <span class="text-sm">Sentences</span>
    </div>
    <div class="text-center">
      <span class="text-xl text-blue-700 font-bold block">{paragraphCount}</span>
      <span class="text-sm">Paragraphs</span>
    </div>
    <div class="text-center">
      <span class="text-xl text-blue-700 font-bold block">{formatReadingTime(readingTime)}</span>
      <span class="text-sm">Reading time</span>
    </div>
  </div>

  <!-- Additional Statistics -->
  {#if wordCount > 0}
    <div class="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600 border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div class="text-center">
        <span class="text-lg text-green-700 font-bold block">{uniqueWords}</span>
        <span class="text-xs">Unique Words</span>
      </div>
      <div class="text-center">
        <span class="text-lg text-green-700 font-bold block">{avgWordLength}</span>
        <span class="text-xs">Avg Word Length</span>
      </div>
      <div class="text-center">
        <span class="text-lg text-green-700 font-bold block">{Math.round((uniqueWords / wordCount) * 100)}%</span>
        <span class="text-xs">Vocabulary Diversity</span>
      </div>
    </div>
  {/if}

  <!-- Export Utility -->
  {#if text}
    <ExportUtility text={text} filename={exportFilename} />
  {/if}
</div>
