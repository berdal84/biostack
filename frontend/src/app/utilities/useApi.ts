import axios, {AxiosResponse} from "axios";
import { useCallback } from "react";
import { useAppContext, useAppDispatchContext } from "../contexts/AppContext";
import { Page, Sample, SampleCreate, SampleUpdate } from "@/app/types";


/**
 * Create a new AXIOS instance to query the API
 * See https://www.npmjs.com/package/axios
*/
const api = axios.create({
    baseURL: `${process.env.BIOSTACK_API_HOST ?? 'http://localhost'}/sample`,
    timeout: 3000,
    headers: {
        'Accept': 'application/json',
    }
});

/**
 * Hook wrapping several callbacks to interact with Biostack's API while updating the AppContext
 */
export function useAPI() {
    const { page } = useAppContext();
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
        index: number,
        limit: number = page.limit
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
    }, [page, dispatch, handleError])

    /**
     * Get a sample from a given id.
     */
    const getSample = useCallback(async (id: number): Promise<Sample | null> => {
        dispatch({ type: 'setStatus', payload: { status: 'loading' } })
        try {
            const response: AxiosResponse<Sample> = await api.get(`/${id}`);
            dispatch({type: 'setSample', payload: {sample: response.data}})
            return response.data;
        } catch (error: any) {
            return handleError(error)
        }
    }, [dispatch, handleError])


    /**
     * Create a new sample
     */
    const createSample = async (sample: SampleCreate) => {
        try {
            const response: AxiosResponse<Sample> = await api.post("/", sample);
            dispatch({ type: 'setSample', payload: { sample: response.data } })
            return response.data;
        } catch (error: any) {
            return handleError(error)
        }
    };

    /**
     * Update a given sample
     * @param id sample id to update
     * @param changes the changes to apply
     */
    const updateSample = async (id: Sample['id'], changes: SampleUpdate) => {
        try {
            const response: AxiosResponse<Sample> = await api.put(`/${id}`, changes)
            const sample = response.data;
            dispatch({ type: 'setSample', payload: { sample } })
            return sample;
        } catch (error: any) {
            return handleError(error)
        }
    };

    /**
     * Delete a given sample
     * @param id sample id to delete
     */
    const deleteSample = async (id: Sample['id']) => {
        try {
            const response: AxiosResponse<Sample> = await  api.delete(`/${id}`)
            dispatch({ type: 'setSample', payload: { sample: null } })
            return response.data;
        } catch (error: any) {
            return handleError(error)
        }
    };

    /**
     * Upload a file to an existing sample
     * @param id The id of the sample to attach the file on
     * @param file The file to attach. 
     * @returns The updated sample
     * 
     * TODO: merge this with update?
     *       I started with an independent upload, to be able to handle various locations in the future.
     *       For example, files might be stored into an S3 or any other storage system.
     */
    const uploadFile = async (id: Sample['id'], file: File) =>  {
        try {
            const form = new FormData();
            form.append('file', file, file.name);
            
            const response: AxiosResponse<Sample> = await api.post(
                `/${id}/upload`,
                form,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )
            dispatch({ type: 'setSample', payload: { sample: response.data } })
            return response.data;
        } catch (error: any) {
            return handleError(error)
        }
    }

    /** Refresh the current page */
    const refreshPage = async () => getPage(page.index)

    return {
        getPage,
        getSample,
        createSample,
        updateSample,
        deleteSample,
        refreshPage,
        uploadFile,
    }
}

