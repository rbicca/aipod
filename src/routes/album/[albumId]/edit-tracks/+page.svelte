<script lang="ts">
	import type { PageData } from "./$types";
	import { onMount } from "svelte";
    import { Grid } from 'ag-grid-community';
    import type { GridOptions } from 'ag-grid-community';
    import 'ag-grid-community/styles/ag-grid.css';
    import 'ag-grid-community/styles/ag-theme-alpine.css';

    export let data: PageData;
    const genreArray = data.genres.map(g => g.genreName);
    const deletedIds: Set<number> = new Set();

    let grid: Grid;

    const gridOptions: GridOptions = {
        defaultColDef: {
            sortable: true,
            filter: true,
            flex: 1,
            resizable: true,
            editable: true
        },
        rowSelection: 'multiple',
        columnDefs: [
            { field: 'trackID', headerName: 'ID', editable: false, checkboxSelection: true},
            { field: 'trackName', headerName: 'Músicas'},
            { 
                field: 'trackMs', 
                headerName: 'Tempo', 
                type: 'numericColumn',
                valueFormatter: (params) => (params?.value ? `${params?.value / 1000}` : '')
            },
            { field: 'composer', headerName: 'Compositor', cellEditor: 'agLargeTextCellEditor'},
            { field: 'genre', headerName: 'Gênero', cellEditor: 'agSelectCellEditor', cellEditorParams: { values: genreArray }}
        ],
        rowData: data.tracks,
        getRowId: (params) => params.data.trackID
    };

    onMount(() => {
        const gridEl = document.getElementById('myGrid');
        if(!gridEl){
            throw new Error('Grid element not found');
        }
        grid = new Grid(gridEl, gridOptions);
    });


    const handleAddRow = () => {
        const rowCount = gridOptions.api?.getDisplayedRowCount();
        if(!rowCount){
            console.error('Grid API not accessible');
            return;
        }

        let maxId = 0;
        gridOptions.api?.forEachNode((rowNode => {
            if (rowNode.data.trackID > maxId) maxId = rowNode.data.trackID;
        }));

        const newRow = {
            trackID: maxId + 1,
            trackName: '',
            trackMs: 0,
            composer: 'Megan',
            genre:''
        };
        gridOptions.api?.applyTransaction({ 
            add: [newRow],
            addIndex: rowCount
        });

        setTimeout(() => {
            const firstCol = gridOptions.columnApi?.getAllDisplayedColumns()[0];
            gridOptions.api?.ensureColumnVisible(firstCol!);
            gridOptions.api?.ensureIndexVisible(rowCount);
            gridOptions.api?.setFocusedCell(rowCount, firstCol!);
        }, 50);

    };

    const handleDelete = () => {
        const selectedRowData = gridOptions.api?.getSelectedRows();
        selectedRowData?.forEach(({trackID}) => deletedIds.add(trackID));
        gridOptions.api?.applyTransaction({ remove: selectedRowData});
    };

</script>

<div class="px-4">
    <h1 class="is-size-1">Músicas de { data.album.albumTitle }</h1>

    <div class="py-4 columns">
        <div id="myGrid" style="height: 500px;" class="ag-theme-alpine column is-10"></div>
        <div class="column px-4">
            <button class="button py-2" on:click={handleAddRow} >Nova música</button>
            <button class="button py-2" on:click={handleDelete} >Apagar</button>
        </div>
    </div>

</div>