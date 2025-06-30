<script>
  import AppTextarea from './AppTextarea.svelte';
  import ExportUtility from './ExportUtility.svelte';
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

<div class="card bg-white shadow-xl rounded-2xl p-10 mb-10 w-full max-w-4xl mx-auto">
  <div class="flex flex-wrap justify-between items-center mb-6 gap-4">
    <div class="flex items-center gap-3">
      <label class="inline-flex items-center gap-2 text-base text-gray-700">
        <input 
          type="checkbox" 
          bind:checked={showSpaces} 
          class="checkbox checkbox-primary"
        />
        Include spaces in character count
      </label>
    </div>
    <div class="flex gap-3">
      <button
        type="button"
        class="btn btn-sm btn-outline btn-primary"
        on:click={trimText}
        aria-label="Trim whitespace"
      >
        Trim Whitespace
      </button>
      <button
        type="button"
        class="btn btn-sm btn-outline btn-accent"
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
        class="btn btn-sm btn-outline btn-error"
        on:click={clearText}
        aria-label="Clear text"
        disabled={!text}
      >
        Clear
      </button>
    </div>
  </div>
  
  <AppTextarea
    bind:value={text}
    placeholder="Paste or type your text here..."
    rows={8}
    ariaLabel="Text to analyze"
    ariaDescribedby={`counter-stats${charLimitExceeded ? ' char-limit-warning' : ''}`}
    maxlength={CHAR_LIMIT}
  />
  
  {#if charLimitExceeded}
    <div id="char-limit-warning" class="text-red-600 text-base mt-2">Character limit exceeded ({CHAR_LIMIT} max).</div>
  {/if}
  
  <div
    id="counter-stats"
    class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-6 text-lg font-medium text-gray-700 border border-gray-200 rounded-lg p-6 bg-gray-50 shadow-sm"
  >
    <div class="text-center">
      <span class="text-2xl text-blue-700 font-bold block">{wordCount}</span>
      <span class="text-base">Words</span>
    </div>
    <div class="text-center">
      <span class="text-2xl text-blue-700 font-bold block">{showSpaces ? charCount : charCountNoSpaces}</span>
      <span class="text-base">Characters {showSpaces ? '' : '(no spaces)'}</span>
    </div>
    <div class="text-center">
      <span class="text-2xl text-blue-700 font-bold block">{sentenceCount}</span>
      <span class="text-base">Sentences</span>
    </div>
    <div class="text-center">
      <span class="text-2xl text-blue-700 font-bold block">{paragraphCount}</span>
      <span class="text-base">Paragraphs</span>
    </div>
    <div class="text-center">
      <span class="text-2xl text-blue-700 font-bold block">{formatReadingTime(readingTime)}</span>
      <span class="text-base">Reading time</span>
    </div>
  </div>

  <!-- Additional Statistics -->
  {#if wordCount > 0}
    <div class="mt-6 grid grid-cols-2 md:grid-cols-3 gap-6 text-base text-gray-600 border border-gray-200 rounded-lg p-6 bg-gray-50">
      <div class="text-center">
        <span class="text-xl text-green-700 font-bold block">{uniqueWords}</span>
        <span class="text-sm">Unique Words</span>
      </div>
      <div class="text-center">
        <span class="text-xl text-green-700 font-bold block">{avgWordLength}</span>
        <span class="text-sm">Avg Word Length</span>
      </div>
      <div class="text-center">
        <span class="text-xl text-green-700 font-bold block">{Math.round((uniqueWords / wordCount) * 100)}%</span>
        <span class="text-sm">Vocabulary Diversity</span>
      </div>
    </div>
  {/if}

  <!-- Export Utility -->
  {#if text}
    <ExportUtility text={text} filename={exportFilename} />
  {/if}
</div>
