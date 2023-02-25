<script lang="ts">
    import type { PageData } from "./$types";
    export let data: PageData;

    const converMS = (segundos: number) => {
        const dateObj = new Date(segundos * 1000);
        //const hours = dateObj.getUTCHours();
        const minutes = dateObj.getUTCMinutes();
        const seconds = dateObj.getSeconds();

        /*
        const timeString = hours.toString().padStart(2, '0') + ':' + 
              minutes.toString().padStart(2, '0') + ':' + 
              seconds.toString().padStart(2, '0');
        */

        const timeString = minutes.toString().padStart(2, '0') + ':' + 
                seconds.toString().padStart(2, '0');

        return timeString;
    };

</script>

<div class="px-4">
    <h1 class="is-size-1">Disco: {data.album.albumTitle} </h1>
    <p class="is-size-4">De {data.album.artistName}</p>

    <table class="table mt-6">
        <thead>
            <th>#</th>
            <th>Música</th>
            <th>Duração</th>
        </thead>
        <tbody>
            {#each data.tracks as track, i}
                <tr>
                    <td>{i+1}</td>
                    <td>{track.trackName}</td>
                    <td>{converMS(track.trackMs / 1000)}</td>
                </tr>
            {/each}
        </tbody>
    </table>

    <h2 class="is-size-3 mb-4 mt-6">Trocar nome do disco</h2>
    <form method="post">
        <input type="text" class="input" name="albumTitle" value={data.album.albumTitle} style="max-width: 50ch;">
        <input type="hidden" name="albumId" value={data.album.albumId}>

        <button class="button is-primary" type="submit" formaction="?/updateAlbumTitle" >Trocar</button>
        <button class="button is-danger" type="submit" formaction="?/deleteAlbum" >Apagar</button>
    </form>
</div>
