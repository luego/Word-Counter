<script>
  let input = '';
  let output = '';
  let mode = 'uppercase';

  function convertText() {
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
      default:
        output = input;
    }
  }

  // Convert on every change
  $: convertText();
  
  function copyToClipboard() {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(output);
    }
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
    </select>
  </div>
  <textarea
    class="w-full border border-gray-300 rounded-lg px-4 py-3 text-base bg-white text-gray-900 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
    rows="5"
    bind:value={input}
    placeholder="Paste or type your text here..."
  ></textarea>
  <div class="flex gap-4 mb-4 justify-center">
    <button
      type="button"
      class="px-3 py-1 rounded-lg border text-sm font-semibold transition border-gray-300 bg-gray-100 text-gray-700 hover:bg-blue-100"
      on:click={convertText}
    >
      Convert
    </button>
  </div>
  <div class="mb-4">
    <label for="result-output" class="font-semibold text-gray-700">Result:</label>
    <textarea
      id="result-output"
      class="w-full border border-gray-300 rounded-lg px-4 py-3 text-base bg-gray-50 text-gray-900 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
      rows="5"
      value={output}
      readonly
    ></textarea>
  </div>
  <div class="flex gap-4">
    <button
      type="button"
      class="px-3 py-1 rounded-lg border text-sm font-semibold transition border-gray-300 bg-gray-100 text-gray-700 hover:bg-blue-100"
      on:click={copyToClipboard}
    >
      Copy Result
    </button>
    <button
      type="button"
      class="px-3 py-1 rounded-lg border text-sm font-semibold transition border-gray-300 bg-gray-100 text-gray-700 hover:bg-red-100"
      on:click={() => { input = ''; output = ''; }}
    >
      Clear
    </button>
  </div>
</div>
