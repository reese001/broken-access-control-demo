// retrieves JSON data from a URL and runs a function when the data is retrieved, passing along the JSON data as an argument
// arguments :
// retrieveURL : string - the URL to retrieve the JSON data from
// cacheExpiry : number|false - amount of time in seconds until the cached data becomes stale and needs to be re-fetched from data source. Set to 10 minutes by default. Set to 0 to disable caching. Set to false to disable caching and have data fetched once at build time.
// debug : boolean - whether to throw an error if one occurs (default is set to true)
// headers : object - optional headers to include with the request
async function getJSONData(
    retrieveScript: string,
    cacheExpiry: number | false = 600,
    debug: boolean = true,
    headers: Record<string, string> = {}
) {
    try {
        const response: Response = await fetch(retrieveScript, {
            next: { revalidate: cacheExpiry },
            headers
        });
        const data: any = await response.json();
        return data;
    } catch (error: any) {
        console.log(`>>> FETCH ERROR: ${error.message}`);
        if (debug) throw error;
        return null;
    }
}

// sends JSON data to a URL and runs a function when the response has been received
// arguments :
// sendURL : string - the URL to send the JSON data to
// sendJSON : object - the JSON data to send
// debug : boolean - whether to throw an error if one occurs (default is set to true)
// headers : object - optional headers to include with the request
async function sendJSONData(
    sendURL: string,
    sendJSON: any,
    debug: boolean = true,
    headers: Record<string, string> = {}
) {
    try {
        const response = await fetch(sendURL, {
            method: "POST",
            headers: { 
                "content-type": "application/json",
                ...headers 
            },
            body: JSON.stringify(sendJSON),
            cache: "no-store",
        });
        const data: any = await response.json();
        return data;
    } catch (error: any) {
        console.log(`>>> FETCH ERROR: ${error.message}`);
        if (debug) throw error;
        return null;
    }
}

export { getJSONData, sendJSONData };
