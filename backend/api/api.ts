export async function apiFetch(endpoint:string){
    const response = await fetch(`http://localhost:8000/api/v1/${endpoint}`, {
        method: 'GET',
        credentials: 'include',
    });
    
    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
}