import type { UseFetchOptions } from "nuxt/app";

export function useApi<T>(
  url: string | (() => string),
  options: UseFetchOptions<T> = {}
) {

  const nuxtApp = useNuxtApp()

  return useFetch(url, {
    ...options,
    $fetch: nuxtApp.$fetchApi,
  });
}
