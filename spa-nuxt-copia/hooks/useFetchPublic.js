const useFetchPublic = async (url, params) => {


    const config = useRuntimeConfig()

    console.log(config)

    const opts = {
        key: url,
        baseURL: config.public.apiUrl,
        async onRequest({options}) {


        },

        async onRequestError({error}) {
            console.log(error.message)
        },

        async onResponseError({response}) {

        },

        ...params

    }

    const {data, pending, error, execute} = await useFetch(url, opts)

    return {
        data, pending, error, execute
    }

}

export default useFetchPublic;