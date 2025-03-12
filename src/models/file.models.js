import {supabase} from '../supabase.client.js'

export async function getFiles()
{
    const {data, error} = await supabase.from('files').select('*')

    if(error) throw error

    return data
}