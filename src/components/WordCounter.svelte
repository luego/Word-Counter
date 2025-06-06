<script>
  // --- Accessibility & UX ---
  let text = "";
  let copySuccess = false;
  let showClear = false;
  const CHAR_LIMIT = 10000;

  // --- Utility regexes ---
  const SENTENCE_REGEX = /[^.!?\s][^.!?]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s|$)/g;
  const PARAGRAPH_REGEX = /(?:[^\r\n][\r\n]?)+/g;

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
      copySuccess = false;
    }
  }

  // --- Clear text ---
  function clearText() {
    text = "";
  }

  // --- Calculate stats ---
  $: wordCount = text.trim().length ? text.trim().split(/\s+/).length : 0;
  $: charCount = text.length;
  $: sentenceCount = text.trim().length ? (text.match(SENTENCE_REGEX) || []).length : 0;
  $: paragraphCount = text.trim().length ? (text.match(PARAGRAPH_REGEX) || []).filter(p => p.trim().length > 0).length : 0;

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
</script>

<div class="bg-white rounded-2xl shadow-lg p-6 mb-8 transition-colors">
  <div class="flex flex-wrap justify-end items-center mb-2 gap-2">
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
    class="flex flex-wrap gap-6 mt-4 justify-start text-base font-medium text-gray-700 border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm"
  >
    <div>
      <span class="text-xl text-blue-700 font-bold">{wordCount}</span> Words
    </div>
    <div>
      <span class="text-xl text-blue-700 font-bold">{charCount}</span> Characters
    </div>
    <div>
      <span class="text-xl text-blue-700 font-bold">{sentenceCount}</span> Sentences
    </div>
    <div>
      <span class="text-xl text-blue-700 font-bold">{paragraphCount}</span> Paragraphs
    </div>
    <div>
      <span class="text-xl text-blue-700 font-bold">{formatReadingTime(readingTime)}</span>
      <span class="text-sm ml-1">Reading time</span>
    </div>
  </div>
</div>
