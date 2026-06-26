<script>
  import '../lib/styles/global.css';
</script>

<slot />

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
