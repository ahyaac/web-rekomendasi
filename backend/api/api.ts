const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export async function apiFetch(endpoint:string){
    const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'GET',
        credentials: 'include',
    });
    
    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
}

export async function apiPost(endpoint:string, data: any){
    const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
}