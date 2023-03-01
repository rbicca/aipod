<script lang="ts">
	import type { ActionData } from "./$types";


    export let form: ActionData;
</script>



<div class="container">
    <h1 class="is-size-3 has-text-weight-semibold my-4">Entrar ou Registrar</h1>
    <form method="post">
        <input type="text"  placeholder="Nome do usuário" class="input my-2" name="username" required />
        <input type="password"  placeholder="Senha" class="input my-2" name="password" required/>
        {#if form?.errorMessage}
            <div class="notification has-text-danger my-2">{form.errorMessage}</div>
        {/if}
        <button class="button mt-4 mr-3" type="submit" formaction="?/register">Registrar</button>
        <button class="button mt-4 is-primary" type="submit" formaction="?/login">Entrar</button>
    </form>
</div>