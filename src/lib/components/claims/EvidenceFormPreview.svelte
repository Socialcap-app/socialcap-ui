<script lang="ts">
	import EvidenceFieldPreview from './EvidenceFieldPreview.svelte';
	import { Alert } from 'flowbite-svelte';
	export let evidenceData: any;
</script>

<div class="">
	
	<div class="mx-10 flex flex-col space-y-4">
		{#each evidenceData as field}
		{#if field.type !== "remark"}
		  <div class="pt-3 pb-0 border-bottom border-secondary-subtle">
			  <p class="ps-0 py-0 text-md text-black font-semibold text-start">
          {field.label}
        </p>
			  <p class="px-0 py-3 mt-1 text-lg text-gray-500 leading-relaxed w-100 text-start">
			    <EvidenceFieldPreview 
				    field={field}
			    />
			  </p>
		  </div>
		{/if}
	  {/each}
	</div>
</div>
