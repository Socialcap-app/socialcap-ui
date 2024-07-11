<script lang="ts">
	import { Avatar } from 'flowbite-svelte';
	export let name: string = '', size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none' = 'md';


</script>

<Avatar size={size} class="h-12 w-12">
	<img alt="" src={"/logos/" + name.toLowerCase() + ".svg"} class="rounded-full" />
</Avatar>
