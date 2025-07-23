import { useState } from 'react'
import axios, { AxiosResponse } from 'axios'
import { getCookie } from 'cookies-next'

interface IPostApiState {
  loading: boolean
  error: string | null
  data: object | null
}
interface IMutateProps {
  apiPath?: string
  method?: 'PUT' | 'DELETE' | 'POST' | 'GET' | 'PATCH'
  header?: object
  baseURL?: string
  withCredentials?: boolean
  contentType?: string
}
type TMutateReturn = [
  (object: any, params?: any) => any,
  boolean,
  object | null,
]
const useMutateApi = ({
  apiPath,
  method,
  baseURL,
  header,
  withCredentials = true,
  contentType = 'application/json;charset=UTF-8',
}: IMutateProps): TMutateReturn => {
  const [responseData, setResponseData] = useState<IPostApiState>({
    loading: false,
    error: null,
    data: null,
  })

  const fetchApi = async (variables: object, params?: object) => {
    setResponseData({ ...responseData, loading: true })
    const axiosConfig = {
      baseURL: baseURL ? baseURL : process.env.NEXT_PUBLIC_REACT_APP_API_URL,
      url: apiPath,
      method: method ? method : 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': contentType,
        'Accept-Language': 'tr',
        credentials: 'include',
        Authorization: `Bearer ${getCookie('accessToken')}`,
        ...header,
      },
      withCredentials: withCredentials,
      params: params,
      data: variables,
    }

    const response = await axios(axiosConfig)
      .then((res: AxiosResponse) => res)
      .catch((err) => {
        return { ...err, ...err.response }
      })

    if (response.message !== undefined) {
      switch (response.status) {
        case 400:
          const errorMessages =
            response.data &&
            response.data.Errors &&
            Array.isArray(response.data.Errors)
              ? response.data.Errors.map(
                  (err: { Message: string }) => err.Message,
                ).join('. ')
              : ''
          const errorMessage: string =
            errorMessages ||
            response.data?.error ||
            'An unexpected error occurred'

          setResponseData({
            loading: false,
            error: errorMessage,
            data: null,
          })

          return {
            data: null,
            error: errorMessage,
            loading: false,
          }
        case 404:
          setResponseData({
            loading: false,
            error: 'Sunucu hatası',
            data: null,
          })

          return {
            data: null,
            error: 'Sunucu hatası',
            loading: false,
          }

        case 500:
          setResponseData({
            loading: false,
            error: 'UnexpectedErrorOccurred',
            data: null,
          })

          return {
            data: null,
            error: 'UnexpectedErrorOccurred',
            loading: false,
          }
        case null:
          setResponseData({
            loading: false,
            error: 'UnexpectedErrorOccurred',
            data: null,
          })

          return {
            data: null,
            error: 'UnexpectedErrorOccurred',
            loading: false,
          }
        default:
          setResponseData({
            loading: false,
            error: 'beklenmeyen hata',
            data: null,
          })

          return { data: null, error: 'beklenmeyen hata', loading: false }
      }
    }
    setResponseData({ loading: false, error: null, data: response.data.data })

    return { loading: false, error: null, data: response.data.data }
  }

  return [fetchApi, responseData.loading, responseData.data]
}
export default useMutateApi
