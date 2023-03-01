<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;

    let searchTerm = '';
    let timer: NodeJS.Timeout;
    let tracks = data.tracks;

    const fetchTacks = () => {
        fetch(`/api/searchTracks?searchTerm=${searchTerm}`)
            .then((res) => res.json())
            .then(data => {
                tracks = data;
                //console.log(data);
            });
    };

    const handleSearch = (e: Event) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            const target = e.target as HTMLInputElement;
            searchTerm = target.value;     
            fetchTacks();       
        }, 150);
    };

</script>

<div class="px-4">
    <h1 class="is-size-1 mb-5">Músicas</h1>
    
    <input type="search" value={searchTerm}  placeholder="Procurar..." class="input mb-5"  style="max-width: 80ch;" 
        on:input={handleSearch}
    />

    <table class="table">
        <thead>
            <th>Música</th>
            <th>Artista</th>
            <th>Disco</th>
            <th>Gênero</th>
        </thead>
        <tbody>
            {#each tracks as track}
                <tr>
                    <td>{track.trackName}</td>
                    <td>{track.artistName}</td>
                    <td><a href={`/album/${track.albumId}`}>{track.albumTitle}</a></td>
                    <td>{track.genre}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>