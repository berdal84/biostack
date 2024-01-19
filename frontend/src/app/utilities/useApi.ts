import axios from "axios";
import { useCallback } from "react";
import { useAppContext, useAppDispatchContext } from "../contexts/AppContext";
import { Page, Sample, SampleCreate, SampleUpdate } from "@/app/types";

/**
 * Create a new AXIOS instance to query the API
 * See https://www.npmjs.com/package/axios
*/
const api = axios.create({
    baseURL: 'http://localhost:8000/sample', // TODO: read from env vars
    timeout: 3000,
});

/**
 * Hook wrapping several callbacks to interact with Biostack's API while updating the AppContext
 */
export function useAPI() {
    const state = useAppContext();
    const dispatch = useAppDispatchContext();

    /**
     * Unique handler for errors
     * Dispatch the error status and return null
     * TODO: add an optionnal defaultResponse in arguments, to return something different than null.
    */
    const handleError =  useCallback(async (reason: any) => {
        dispatch({ type: 'setStatus', payload: { status: "error", message: JSON.stringify(reason) } })
        return null;
    }, [dispatch])

    /**
     * Get a page
     * @param index the page index to fetch (default is current page.index)
     * @param limit the page item limit (default is current page.limit)
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

            }).catch(handleError);
    }, [state, dispatch, handleError])

    /**
     * Get a sample from a given id.
     */
    const getSample = useCallback((id: number) => {

        dispatch({ type: 'setStatus', payload: { status: 'loading' } })

        return api.get<Sample>(`/${id}`)
            .then((response) => {
                const sample = response.data;
                dispatch({ type: 'setSample', payload: { sample } })
                return sample;
            }).catch(handleError);
    }, [dispatch, handleError])


    /**
     * Create a new sample
     */
    const createSample = useCallback((sample: SampleCreate) => {
        return api.post<Sample>("/", sample)
            .then((response) => {
                const sample = response.data;
                dispatch({ type: 'setSample', payload: { sample } })
                return sample;
            }).catch(handleError);
    }, [dispatch, handleError]);

    /**
     * Update a given sample
     * @param id sample id to update
     * @param changes the changes to apply
     */
    const updateSample = useCallback((id: Sample['id'], changes: SampleUpdate) => {
        return api.put<Sample>(`/${id}`, changes)
            .then((response) => {
                const sample = response.data;
                dispatch({ type: 'setSample', payload: { sample } })
                return sample;
            }).catch(handleError);
    }, [dispatch, handleError]);

    /**
     * Delete a given sample
     * @param id sample id to delete
     */
    const deleteSample = useCallback((id: Sample['id']) => {
        return api.delete(`/${id}`)
            .then((response) => {
                dispatch({ type: 'setSample', payload: { sample: null } })
                return response.data;
            }).catch(handleError);
    }, [dispatch, handleError]);

    return {
        getPage,
        getSample,
        createSample,
        updateSample,
        deleteSample,
    }
}

