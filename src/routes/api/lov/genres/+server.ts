import { getLovGenres } from "$lib/server/db";
import { json } from "@sveltejs/kit";
import type { APILovResponse } from "../../../../../../../../../../Users/kuka/Tubo/Kit/aipod/src/routes/api/lov/types";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = ({url}) => {

    const searchTerm = url.searchParams.get("searchTerm");

    const rows = getLovGenres(searchTerm);

    //Formatar dados para uma interface camarada
    const data: APILovResponse= {
        columns: [
            { display: 'ID', accessor: 'id', role: 'id' },
            { display: 'Gênero', accessor: 'genre', role: 'display' },
        ],
        data: rows
    };

    return json(data);
}