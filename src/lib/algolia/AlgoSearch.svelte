<script>
  import algoliasearch from 'algoliasearch/lite';
  import instantsearch from 'instantsearch.js';
  import { searchBox, hits, configure, pagination } from 'instantsearch.js/es/widgets';
  import { onMount } from 'svelte';
  import HitItem from './HitItem.svelte'; // Ensure the path is correct

  const ALGOLIA_APP_ID = import.meta.env.VITE_PUBLIC_ALGOLIA_APP_ID;
  const ALGOLIA_ADMIN_KEY = import.meta.env.VITE_PUBLIC_ALGOLIA_ADMIN_KEY;
  const ALGOLIA_INDEX_NAME = import.meta.env.VITE_PUBLIC_ALGOLIA_INDEX_NAME;

  let searchClient, search;

  onMount(() => {
    searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

    search = instantsearch({
      indexName: ALGOLIA_INDEX_NAME,
      searchClient,
      future: { preserveSharedStateOnUnmount: true }
    });

    search.addWidgets([
      searchBox({
        container: '#searchbox'
      }),
      hits({
        container: '#hits',
        templates: {
          item: () => `<div class="hit-placeholder"></div>` // Placeholder for the hit item
        },
        transformItems(items) {
          // After rendering hits, instantiate the HitItem component for each
          items.forEach(hit => {
            const target = document.querySelector(`.hit-placeholder:nth-of-type(${items.indexOf(hit) + 1})`);
            if (target) {
              new HitItem({
                target,
                props: {
                  name: hit['cast.0.name'], // Access the name from the hit
                  description: hit['cast.0.description'], // Access the description from the hit
                  image: hit.image // Access the image from the hit
                }
              });
            }
          });
          return items;
        }
      }),
      configure({
        hitsPerPage: 8
      }),
      pagination({
        container: '#pagination'
      })
    ]);

    search.start();
  });
</script>

<div>
  <div id="searchbox"></div>
  <div id="hits"></div>
  <div id="pagination"></div>
</div>

<style>
  .hit-placeholder {
    margin-bottom: 20px;
  }
</style>
