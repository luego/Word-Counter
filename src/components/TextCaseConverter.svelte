<script>
  let input = '';
  let output = '';
  let mode = 'uppercase';
  let copySuccess = false;

  function convertText() {
    try {
      switch (mode) {
        case 'uppercase':
          output = input.toUpperCase();
          break;
        case 'lowercase':
          output = input.toLowerCase();
          break;
        case 'titlecase':
          output = input.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
          break;
        case 'sentencecase':
          output = input
            .toLowerCase()
            .replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
          break;
        case 'camelcase':
          output = input
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
            .replace(/^[A-Z]/, c => c.toLowerCase());
          break;
        case 'snakecase':
          output = input
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+/g, '_')
            .replace(/^_|_$/g, '');
          break;
        case 'kebabcase':
          output = input
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
          break;
        default:
          output = input;
      }
    } catch (error) {
      console.error('Error converting text:', error);
      output = 'Error: Unable to convert text';
    }
  }

  // Convert on every change
  $: convertText();
  
  async function copyToClipboard() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      copySuccess = true;
      setTimeout(() => (copySuccess = false), 1500);
    } catch (error) {
      console.error('Failed to copy text:', error);
      copySuccess = false;
    }
  }

  function clearAll() {
    input = '';
    output = '';
  }
</script>

<div class="bg-white rounded-2xl shadow-lg p-6 mb-8 transition-colors">
  <div class="flex flex-col sm:flex-row gap-4 mb-4 items-center">
    <label for="case-mode-select" class="font-semibold text-gray-700">Convert to:</label>
    <select
      id="case-mode-select"
      class="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900"
      bind:value={mode}
      aria-label="Case mode"
    >
      <option value="uppercase">UPPERCASE</option>
      <option value="lowercase">lowercase</option>
      <option value="titlecase">Title Case</option>
      <option value="sentencecase">Sentence case</option>
      <option value="camelcase">camelCase</option>
      <option value="snakecase">snake_case</option>
      <option value="kebabcase">kebab-case</option>
    </select>
  </div>
  
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <div>
      <label for="input-textarea" class="font-semibold text-gray-700 mb-2 block">Input Text:</label>
      <textarea
        id="input-textarea"
        class="w-full border border-gray-300 rounded-lg px-4 py-3 text-base bg-white text-gray-900 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="8"
        bind:value={input}
        placeholder="Paste or type your text here..."
      ></textarea>
    </div>
    
    <div>
      <label for="result-output" class="font-semibold text-gray-700 mb-2 block">Result:</label>
      <textarea
        id="result-output"
        class="w-full border border-gray-300 rounded-lg px-4 py-3 text-base bg-gray-50 text-gray-900 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="8"
        value={output}
        readonly
      ></textarea>
    </div>
  </div>
  
  <div class="flex gap-4 mt-4 justify-center">
    <button
      type="button"
      class="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition disabled:opacity-50"
      on:click={copyToClipboard}
      disabled={!output}
    >
      {#if copySuccess}
        Copied!
      {:else}
        Copy Result
      {/if}
    </button>
    <button
      type="button"
      class="px-4 py-2 bg-gray-100 border border-gray-300 text-gray-700 font-semibold rounded-lg transition hover:bg-gray-200"
      on:click={clearAll}
    >
      Clear All
    </button>
  </div>
</div>
