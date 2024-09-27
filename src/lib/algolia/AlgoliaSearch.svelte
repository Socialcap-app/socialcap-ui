<script>
    import Search from 'svelte-algolia'
	import HitItem from './HitItem.svelte';
  
    // in a real app you'd get your credentials like this:
    const appId = import.meta.env.VITE_ALGOLIA_APP_ID
    const searchKey = import.meta.env.VITE_ALGOLIA_SEARCH_KEY

    const indices = {
    'socialcap-communities': HitItem,  // First index
    'socialcap-plans': HitItem         // Second index
    };
  </script>
  
  <header>
    <Search
      {appId}
      {searchKey}
      {indices}
      placeholder="Search" />
  </header>