<script>
	import PopupComboBox from "$lib/components/PopupComboBox.svelte";
	import TextInput from "$lib/components/TextInput.svelte";

</script>


<div class="px-4">
    <h1 class="text-4xl font-semibold mt-3 mb-12">Nova música</h1>

    <form method="post">
        <TextInput label="Nome" name="name" type="text" class="max-w-xs" />
        <TextInput label="Compositor"  name="composer" type="text" class="max-w-xs" />
        <TextInput label="Milissegundos" name="milliseconds" type="number" class="max-w-xs" />

        <PopupComboBox 
            name="albumId"
            heading="Escolha um disco"
            label="Disco" 
            valueDisplay="Apetite" 
            valueId="1"
            apiEndpoint="/api/lov/albums"
            />

        <input type="hidden" value="1" name="genreID" />

        <button
            type="submit"
            formaction="?/createTrack"
            class="inline-flex items-center rounded-md border border-transparent bg-purple-100 px-4 py-2 text-base font-medium text-purple-700 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
		>
            Criar
        </button>


    </form>
</div>