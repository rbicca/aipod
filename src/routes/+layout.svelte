<script lang="ts">
	import type { LayoutServerData } from "./$types";
    import "../app.css";
    
    export let data: LayoutServerData;
</script>


<header>
    <nav class="navbar is-primary px-4" aria-label="Tela inicial">
        <div class="navbar-brand pr-4">
            <span class="is-size-3 has-text-weight-semibold">Aipod da Megan</span>
        </div>
        <div class="navbar-menu">
            <div class="navbar-start">
                <a class="navbar-item" href="/">Início</a>
            </div>
        </div>

        <div class="navbar-end">
            <div class="navbar-item">
                <div class="buttons">
                    {#if data?.username}
                    <a 
                        href="/logout" 
                        class="button is-primary" 
                        data-sveltekit-preload-data="off" 
                        data-sveltekit-reload
                        > Olá {data.username}, Sair</a>
                    {:else}
                        <a href="/login" class="button is-primary">Entrar</a>
                    {/if}
                </div>
            </div>
        </div>
    </nav>
</header>
<slot />
