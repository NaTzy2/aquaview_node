import {supabase} from '../supabase.client.js'

export async function getFiles()
{
    const {data, error} = await supabase.from('files').select('*')

    if(error) {
        console.error("Supabase error: ", error)
        throw error
    }

    return data
}