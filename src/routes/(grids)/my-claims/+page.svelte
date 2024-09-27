<script lang="ts">
  import MyClaims from "./MyClaims.svelte";
  import { MetaTag } from "$lib/components";

	const path: string = '/home';
  const description: string = '';
  const title: string = 'Socialcap';
  const subtitle: string = 'My Claims';
</script>

<MetaTag {path} {description} {title} {subtitle} />

<main class="p-4">
  <MyClaims />
</main>
