import axios from "axios";
import { useCallback } from "react";
import { useAppContext, useAppDispatchContext } from "../contexts/AppContext";
import { Page, Sample, SampleCreate } from "@/app/types";

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
    const getPage = useCallback(async (
        index: number = state.page.index,
        limit: number = state.page.limit
    ) => {

        dispatch({ type: 'setStatus', payload: { status: 'loading' } })

        return api.get<Page<Sample>>(
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

                return response.data;

            }).catch((reason: any) => {
                dispatch({ type: 'setStatus', payload: { status: "error", message: JSON.stringify(reason) } })
            });
    }, [state])

    /**
     * Callback to trigger the fetch of a given sample from a given id.
     */
    const getSample = useCallback((id: number | null) => {

        if (id === null) {
            return dispatch({ type: 'setSample', payload: { sample: null } })
        }

        dispatch({ type: 'setStatus', payload: { status: 'loading' } })

        return api.get<Sample>(`/${id}`)
            .then((response) => {
                dispatch({ type: 'setSample', payload: { sample: response.data } })
                return response.data;
            }).catch((reason: any) => {
                dispatch({ type: 'setStatus', payload: { status: "error", message: JSON.stringify(reason) } })
            });
    }, [])


    const createSample = (sample: SampleCreate) => {
        return api.post<Sample>("/", sample)
            .then((response) => {
                return response.data;
            }).catch((reason: any) => {
                dispatch({ type: 'setStatus', payload: { status: "error", message: JSON.stringify(reason) } })
                return null;
            });
    }

    return {
        fetchPage: getPage,
        fetchSample: getSample,
        createSample
    }
}

