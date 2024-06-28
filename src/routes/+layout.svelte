<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
  import { page } from "$app/stores";
	import modeobserver from '$lib/modeobserver';
  import { getCurrentSession, getDefaultSession } from "$lib/store/sessions";
  import { redirectUrl } from "$lib/store/navigation"

  let activeSession = getCurrentSession(); 

	onMount(() => {
    activeSession = getCurrentSession();
    const route = getRoute()
    if (! activeSession) {
      if (route.startsWith("/community/")){ // this maybe could be removed and left the functionallity to all urls.. but I'm not sure about.
        redirectUrl.set(route);
      }
      goto("/login");
    } 
    if (activeSession) goto(route);
    console.log("pageUrl=", route)
    modeobserver();
  });
	onMount(modeobserver);
	
  function getRoute() {
    const pathname = $page.url.pathname;
    const search = new URLSearchParams($page.url.search).toString();
    return pathname + (search ? `?${search}` : '');    
  }

	if (import.meta.env.VITE_APP_ENV === 'production') {
		window.dataLayer = window.dataLayer || [];
		window.gtag = function gtag(){window.dataLayer.push(arguments);}
		window.gtag('js', new Date())
		window.gtag('config', import.meta.env.VITE_GA_TAG);
	}
</script>

<slot />

<svelte:head>
  <title>Socialcap App</title>
	<script async src={"https://www.googletagmanager.com/gtag/js?id="+import.meta.env.VITE_GA_TAG}></script>
</svelte:head>