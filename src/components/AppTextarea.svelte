<script lang="ts">
  export let value: string = '';
  export let placeholder: string = '';
  export let rows: number = 8;
  export let readonly: boolean = false;
  export let id: string = '';
  export let name: string = '';
  export let ariaLabel: string = '';
  export let ariaDescribedby: string = '';
  export let maxlength: number | undefined = undefined;
  export let className: string = '';
</script>

<textarea
  id={id}
  name={name}
  class={`w-full border border-gray-300 rounded-lg px-4 py-3 text-base bg-white text-gray-900 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  rows={rows}
  placeholder={placeholder}
  {readonly}
  aria-label={ariaLabel}
  aria-describedby={ariaDescribedby}
  maxlength={maxlength}
  bind:value
></textarea> 