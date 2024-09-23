<script>
    import Search from 'svelte-algolia'
	import HitItem from './HitItem.svelte';
  
    // in a real app you'd get your credentials like this:
    const appId = import.meta.env.VITE_ALGOLIA_APP_ID
    const searchKey = import.meta.env.VITE_ALGOLIA_SEARCH_KEY
    const indexName = import.meta.env.VITE_PUBLIC_ALGOLIA_INDEX_NAME
  </script>
  
  <header style="height: 500px;">
    <Search
      {appId}
      {searchKey}
      indices={{ 'socialcap-communities': HitItem }}
      placeholder="Search Communities" />
  </header>