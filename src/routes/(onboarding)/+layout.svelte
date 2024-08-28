<script lang="ts">
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import '../../app.pcss';
  import Navbar from './Navbar.svelte';
  
  const headerClass = `
    sticky top-0 z-40 mx-auto w-full flex-none border-b border-gray-200 bg-white 
    dark:border-gray-600 dark:bg-gray-800
  `;
  const bgStyle = `
    background-image: url('/images/socialcap-bg-signin.svg');height: 100vh; width: 100vw; 
    backgroundRepeat: no-repeat; backgroundSize: auto;
  `;

  const queryClient = new QueryClient()
</script>

<header	class={headerClass}>
  <Navbar />
</header>
<div 
  class="overflow-hidden lg:flex" 
  style={bgStyle}
  >
  <QueryClientProvider client={queryClient}>
	<div class="relative h-full w-full overflow-y-auto">
		<slot />
	</div>
  </QueryClientProvider>
</div>
