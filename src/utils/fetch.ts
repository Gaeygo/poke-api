import HttpException from "../schema/Error";
import instance from "./axios"

///PREVIOUS RECURSIVE FUNCTION THAT WAS USED

// async function fetchRecursiveData<T>(keys: string[], result: T[] = []): Promise<T[]> {
//   if (keys.length === 0) {
//     return result;
//   }

//   const key = keys.shift()!; 
//   const response = await instance<T>(`/pokemon-form/${key}`);
//   result.push(response.data);

//   return fetchRecursiveData<T>(keys, result);
// }

//Function to fetch initial data was adopted due to type conflict
async function fetchData<T>(key: string): Promise<T> {
    try {
        const response = await instance.get<T>(`/pokemon-form/${key}`);
        return response.data;
    } catch (error) {
        if (error instanceof HttpException) {
            throw error
        }
        throw new HttpException(500, "INTERNAL SERVER ERROR")
    }
}

//fetches data using the promise.all for time saving
async function fetchRecursiveData<T>(keys: string[]): Promise<T[]> {
    const promises = keys.map((key) => fetchData<T>(key));
    const response = await Promise.all(promises);
    return response;
}

export default fetchRecursiveData;
