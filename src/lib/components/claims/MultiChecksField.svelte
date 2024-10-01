<script>
	import { onMount } from 'svelte';
	import { Checkbox } from 'flowbite-svelte';

	export let field, value;
	export { className as class };

	let className;
	let options = [];
	onMount(() => {
		options = field.extras.options.split(',');
		/* console.log('options', options); */
		if (!value) {
			// init the value field !
			value = [];
			options.forEach((t) => {
				value.push('');
			});
		}
	});


</script>

<span>
	{#each options as option, i}
		<Checkbox
			id={`rd-${option}-${i}`}
			class={className}
			bind:group={value}
			value={option}
			name={field.sid}
      
      >{option}
      </Checkbox
		>
	{/each}
</span>
