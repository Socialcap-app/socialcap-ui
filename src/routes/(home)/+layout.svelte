<script>
	import '../../app.pcss';
	import Footer from './Footer.svelte';
	import Navbar from './Navbar.svelte';
	import Sidebar from './Sidebar.svelte';
  import ActivityPanel from "./ActivityPanel.svelte";
	import { QueryClientProvider, QueryClient } from '@tanstack/svelte-query'

	let drawerHidden = false;
	// Create a client
	const queryClient = new QueryClient()
 
</script>

<header
	class="sticky top-0 z-40 mx-auto w-full flex-none border-b border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800"
>
	<Navbar bind:drawerHidden />
</header>
<div class="overflow-hidden lg:flex">
	<QueryClientProvider client={queryClient}>
  	<Sidebar bind:drawerHidden />
  	<div class="relative h-full w-full overflow-y-auto lg:ms-64">
      <div class="w-full max-w-2xl mx-auto">
        <slot />
      </div>
  		<Footer />
  	</div>
    <div class="hidden xl:block xl:ms-8 w-full max-w-md border-s border-gray-200">
      <ActivityPanel />
    </div> 
	</QueryClientProvider>
</div>
