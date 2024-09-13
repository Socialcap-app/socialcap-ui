<script lang="ts">
	export let value = '';
    export let entity = '';
    const placeholder = `Search ${entity}...`;
</script>

<div class="w-80">
	<label for="default-search" class="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
		>Search</label
	>
	<div class="relative">
		<div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
			<svg
				class="h-4 w-4 text-gray-500 dark:text-gray-400"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 20 20"
			>
				<path
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
				/>
			</svg>
		</div>
		<input
			bind:value={value}
			type="search"
			id="default-search"
			placeholder={placeholder}
			required
			class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
		/>
	</div>
</div>
