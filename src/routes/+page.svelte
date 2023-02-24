<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<h1>Aipod da Megan</h1>

<pre>
    <code>{JSON.stringify(data.tracks, null, 2)}</code>
</pre>