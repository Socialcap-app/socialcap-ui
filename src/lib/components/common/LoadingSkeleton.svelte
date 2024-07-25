<script>
	export let isLoading;
    export let extraClasses = '';
</script>

{#if isLoading}
	<div class={"loading-shimmer rounded bg-gray-100 w-full h-10 " + extraClasses}>
		<div class="shimmer"></div>
	</div>
{:else}
	<slot />
{/if}

<style>
	.loading-shimmer {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		overflow: hidden;
	}

	.shimmer {
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(
			90deg,
			rgba(224, 224, 224, 0) 0%,
			rgba(224, 224, 224, 0.8) 50%,
			rgba(224, 224, 224, 0) 100%
		);
		animation: shimmer 1.5s infinite;
	}

	@keyframes shimmer {
		100% {
			left: 100%;
		}
	}
</style>
