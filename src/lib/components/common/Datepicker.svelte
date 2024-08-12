<script lang="ts">
	import { onMount } from 'svelte';
	export let name: string,
		value: Date | undefined,
		placeholder: string | undefined,
		disabled: boolean = false;
	placeholder = placeholder ?? 'Pick a date';
	const datepickerFormat = 'YYYY-MM-DD';
	let valueString : string;
	function convertValueForBinding() {
		if(value){
			// Parse the existing valueString (assuming it is in ISO format or similar)
			const date = new Date(value);

			// Check if the date is valid
			if (!isNaN(date.getTime())) {
				let month = '' + (date.getMonth() + 1),
					day = '' + date.getDate(),
					year = date.getFullYear();

				// Add leading zeros if necessary
				if (month.length < 2) month = '0' + month;
				if (day.length < 2) day = '0' + day;

				// Set valueString to the formatted date
				valueString = [year, month, day].join('-');
			}else {
            console.warn('Invalid date string:', value);
        	}
		}else{

			const now = new Date();
			let month = '' + (now.getMonth() + 1),
				day = '' + now.getDate(),
				year = now.getFullYear();
	
			if (month.length < 2) month = '0' + month;
			if (day.length < 2) day = '0' + day;
	
			valueString = [year, month, day].join('-');
		}
	}
	onMount(() => {
		convertValueForBinding();
	});
</script>

<div class="relative">
	<div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
		<svg
			class="h-4 w-4 text-gray-500 dark:text-gray-400"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
			fill="currentColor"
			viewBox="0 0 20 20"
		>
			<path
				d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"
			/>
		</svg>
	</div>
	<input
		id={name}
		datepicker
		type="date"
		{name}
		class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
		{placeholder}
		datepicker-format={datepickerFormat}
		bind:value={valueString}
		{disabled}
		datepicker-buttons
	/>
</div>
