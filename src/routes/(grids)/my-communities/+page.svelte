<script lang="ts">
  import { onMount } from 'svelte';
  import { Breadcrumb, BreadcrumbItem, P } from 'flowbite-svelte';
  import { MetaTag } from "$lib/components";
	import MyCommunities from "./MyCommunities.svelte";

	const path: string = '/home';
  const description: string = '';
  const title: string = 'Socialcap';
  const subtitle: string = 'My Communities';
</script>

<MetaTag {path} {description} {title} {subtitle} />

<main class="py-4">
  <!-- only on mobile -->
  <Breadcrumb class="mb-5 lg:hidden">
    <BreadcrumbItem home href="/home">Home</BreadcrumbItem>
    <BreadcrumbItem>My Communities</BreadcrumbItem>
  </Breadcrumb>

  <MyCommunities />
</main>
