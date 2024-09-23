<script>
	export let hit;
</script>

<h2>{@html hit.name}</h2>

<div>
	<ul>
		<!-- <li>Type: {@html hit.type.join(`, `)}</li> -->
		<li>Name: {@html hit.name}</li>
		<li>Description: {@html hit.description}</li>
	</ul>
	<img src={hit.image} alt={hit.name} />
</div>

<style>
	/* highlights text matching the search string */
	:global(em) {
		color: darkcyan;
		line-height: 1.2em;
		border-radius: 3pt;
		font-style: normal;
	}
	div {
		display: flex;
		justify-content: space-between;
	}
</style>
