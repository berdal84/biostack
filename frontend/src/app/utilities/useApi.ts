import axios, {AxiosResponse} from "axios";
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
        try {
            // TODO: investigate why my IDE highlight "params" while it is working fine at runtime
            const response: AxiosResponse<Page<Sample>> = await api.get('/', { params: { index, limit }})
            const page = response.data;
            dispatch({ type: 'setPage', payload: { page: response.data } })
            return page;
        } catch (error: any) {
            return handleError(error)
        }
    }, [state, dispatch, handleError])

    /**
     * Get a sample from a given id.
     */
    const getSample = useCallback(async (id: number): Promise<Sample | null> => {
        dispatch({ type: 'setStatus', payload: { status: 'loading' } })
        try {
            const response: AxiosResponse<Sample> = await api.get(`/${id}`);
            const sample = response.data;
            dispatch({type: 'setSample', payload: {sample}})
            return sample;
        } catch (error: any) {
            return handleError(error)
        }
    }, [dispatch, handleError])


    /**
     * Create a new sample
     */
    const createSample = useCallback(async (sample: SampleCreate) => {
        try {
            const response: AxiosResponse<Sample> = await api.post("/", sample);
            const sample = response.data;
            dispatch({ type: 'setSample', payload: { sample } })
            return sample;
        } catch (error: any) {
            return handleError(error)
        }
    }, [dispatch, handleError]);

    /**
     * Update a given sample
     * @param id sample id to update
     * @param changes the changes to apply
     */
    const updateSample = useCallback(async (id: Sample['id'], changes: SampleUpdate) => {
        try {
            const response: AxiosResponse<Sample> = await api.put(`/${id}`, changes)
            const sample = response.data;
            dispatch({ type: 'setSample', payload: { sample } })
            return sample;
        } catch (error: any) {
            return handleError(error)
        }
    }, [dispatch, handleError]);

    /**
     * Delete a given sample
     * @param id sample id to delete
     */
    const deleteSample = useCallback(async (id: Sample['id']) => {
        try {
            const response: AxiosResponse<Sample> = await  api.delete(`/${id}`)
            dispatch({ type: 'setSample', payload: { sample: null } })
            return response.data;
        } catch (error: any) {
            return handleError(error)
        }
    }, [dispatch, handleError]);

    return {
        getPage,
        getSample,
        createSample,
        updateSample,
        deleteSample,
    }
}

