<script lang="ts">
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';
	import { MetaTag } from '$lib/components';
	import MyIdentity from './MyIdentity.svelte';

	const path: string = '/';
	const description: string = '';
	const title: string = 'Socialcap';
	const subtitle: string = 'My Profile';
</script>

<MetaTag {path} {description} {title} {subtitle} />

<main class="lg:p-8 lg:pt-24">
	<MyIdentity />
</main>
