<script>
  export let text = '';
  export let filename = 'export';
  export let exportType = 'txt';
  
  let exportSuccess = false;

  function exportText() {
    if (!text) return;

    try {
      let content = text;
      let mimeType = 'text/plain';
      let extension = 'txt';

      switch (exportType) {
        case 'txt':
          content = text;
          mimeType = 'text/plain';
          extension = 'txt';
          break;
        case 'csv':
          content = text.split('\n').map(line => `"${line.replace(/"/g, '""')}"`).join('\n');
          mimeType = 'text/csv';
          extension = 'csv';
          break;
        case 'json':
          content = JSON.stringify({ text: text, exportedAt: new Date().toISOString() }, null, 2);
          mimeType = 'application/json';
          extension = 'json';
          break;
        case 'html':
          content = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Exported Text</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .content { white-space: pre-wrap; }
    </style>
</head>
<body>
    <div class="content">${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
</body>
</html>`;
          mimeType = 'text/html';
          extension = 'html';
          break;
        default:
          content = text;
          mimeType = 'text/plain';
          extension = 'txt';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      exportSuccess = true;
      setTimeout(() => (exportSuccess = false), 2000);
    } catch (error) {
      console.error('Export failed:', error);
      exportSuccess = false;
    }
  }

  function copyToClipboard() {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      exportSuccess = true;
      setTimeout(() => (exportSuccess = false), 1500);
    }).catch(error => {
      console.error('Copy failed:', error);
    });
  }
</script>

<div class="bg-white rounded-lg border border-gray-200 p-4 mb-4">
  <div class="flex flex-wrap items-center gap-3">
    <label for="export-type" class="text-sm font-medium text-gray-700">Export as:</label>
    <select 
      id="export-type"
      bind:value={exportType}
      class="border border-gray-300 rounded px-2 py-1 text-sm bg-white text-gray-900"
    >
      <option value="txt">Text (.txt)</option>
      <option value="csv">CSV (.csv)</option>
      <option value="json">JSON (.json)</option>
      <option value="html">HTML (.html)</option>
    </select>
    
    <input 
      type="text" 
      bind:value={filename}
      placeholder="filename"
      class="border border-gray-300 rounded px-2 py-1 text-sm bg-white text-gray-900 w-32"
    />
    
    <button
      type="button"
      class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition disabled:opacity-50"
      on:click={exportText}
      disabled={!text}
    >
      {#if exportSuccess}
        ✓ Exported!
      {:else}
        Export
      {/if}
    </button>
    
    <button
      type="button"
      class="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded transition disabled:opacity-50"
      on:click={copyToClipboard}
      disabled={!text}
    >
      Copy
    </button>
  </div>
</div> 