import axios from "axios";
import { useCallback } from "react";
import { useAppContext, useAppDispatchContext } from "../contexts/AppContext";
import { Page, Sample } from "@/app/types";

/**
 * Create a new AXIOS instance to query the API
 * See https://www.npmjs.com/package/axios
*/
const api = axios.create({
    baseURL: 'http://localhost:8000/sample', // TODO: read from env vars
    timeout: 3000,
    headers: {}
});

/**
 * Hook wrapping several callbacks to interact with Biostack's API while updating the AppContext
 */
export function useAPI() {
    const state = useAppContext();
    const dispatch = useAppDispatchContext();

    /**
     * Callback to trigger the fetch of a given page
     */
    const fetchPage = useCallback((
        index: number = state.page.index,
        limit: number = state.page.limit
    ) => {

        dispatch({ type: 'setStatus', payload: { status: 'loading' } })

        api.get<Page<Sample>>(
            '/',
            {
                params: {
                    index,
                    limit
                },
            })
            .then((response) => {

                console.debug(response.data);
                console.debug(response.status);
                console.debug(response.statusText);
                console.debug(response.headers);
                console.debug(response.config);

                dispatch({ type: 'setPage', payload: { page: response.data } })

            }).catch((reason: any) => {
                dispatch({ type: 'setStatus', payload: { status: "error", message: JSON.stringify(reason) } })
            });
    }, [state])

    return {
        fetchPage
    }
}

