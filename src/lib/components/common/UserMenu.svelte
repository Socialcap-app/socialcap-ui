<script lang="ts">
	import { imagesPath } from '$lib/variables';
	import { Dropdown, DropdownDivider, DropdownHeader, DropdownItem } from 'flowbite-svelte';
	import { buildGradient, getInitials } from './gradient-svg';
	import GradientAvatar from './GradientAvatar.svelte';

	// export let id: number = 0; // 1,
	export let name: string = ''; // "Neil Sims",
	export let email: string = ''; // "neil.sims@flowbite.com",
	// export let biography: string = ''; // "I love working with React and Flowbites to create efficient and user-friendly interfaces. In my spare time, I enjoys baking, hiking, and spending time with my family.",
	// export let position: string = ''; // "Front-end developer",
	// export let country: string = ''; // "United States",
	// export let status: string = ''; // "Active"

	$: initials = getInitials(name);
</script>

<GradientAvatar initials={initials} gradient={buildGradient(initials)} />
<Dropdown placement="bottom-end">
	<DropdownHeader>
		<span class="block text-sm">{name}</span>
		<span class="block truncate text-sm font-medium">{email}</span>
	</DropdownHeader>
	<DropdownItem>Profile</DropdownItem>
	<DropdownDivider />
	<DropdownItem href="/login">Sign out</DropdownItem>
</Dropdown>

<!--
@component
[Go to docs](https://flowbite-svelte-admin-dashboard.vercel.app/)
## Props
@prop export let id: number = 0;
@prop export let name: string = '';
@prop export let avatar: string = '';
@prop export let email: string = '';
@prop export let biography: string = '';
@prop export let position: string = '';
@prop export let country: string = '';
@prop export let status: string = '';
-->
