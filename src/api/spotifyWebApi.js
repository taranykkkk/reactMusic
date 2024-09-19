import {extractPath} from "@/utils/utils";

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET;

export async function getAccessToken() {
    const authHeader = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${authHeader}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials'
            }),
        });

        const data = await response.json();
        if (response.ok) {
            return data.access_token;
        } else {
            throw new Error(`Error fetching token: ${data.error_description}`);
        }
    } catch (error) {
        console.error('Failed to get access token:', error);
        return null;
    }
}

export async function fetchWebApi(endpoint, method = 'GET', body) {
    const TOKEN = await getAccessToken()
    const res = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            'Content-Type': 'application/json'
        },
        method,
        ...(method !== 'GET' && { body: JSON.stringify(body) })
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(`Error fetching data: ${error}`);
    }

    return await res.json();
}


export async function getCategories() {
    try {
        const response = await fetchWebApi('browse/categories?locale=en_US&limit=9');

        return response.categories.items;
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        return [];
    }
}

export async function getPlaylistsByCategory(categoryName, offset = 0, limit = 10) {
    try {
        const response = await fetchWebApi(
            `browse/categories/${categoryName}/playlists?locale=en_US&limit=${limit}&offset=${offset}`
        );
        return response.playlists.items;
    } catch (error) {
        console.error('Failed to fetch playlists by category:', error);
        return [];
    }
}

export async function getTracksFromPlaylists(playlists, offset = 0, limit = 20) {

    const fetchTracks = async (currentOffset) => {
        try {
            const tracksPromises = playlists.map(async (playlist) => {
                const response = await fetchWebApi(`playlists/${playlist.id}/tracks?locale=en_US&limit=${limit}&offset=${currentOffset}`);
                return response.items.map(item => item.track);
            });

            const tracksArrays = await Promise.all(tracksPromises);
            return tracksArrays.flat();
        } catch (error) {
            console.error('Failed to fetch tracks from playlists:', error);
            return [];
        }
    };

    const filterTracksWithPreviewUrl = (tracks) => tracks.filter(track => track.preview_url !== null);

    const getValidTracks = async () => {
        let allTracks = [];
        let currentOffset = offset;

        while (filterTracksWithPreviewUrl(allTracks).length < limit) {
            const fetchedTracks = await fetchTracks(currentOffset);
            allTracks = [...allTracks, ...fetchedTracks];

            currentOffset += limit;

            if (fetchedTracks.length === 0) {
                break;
            }
        }
        return filterTracksWithPreviewUrl(allTracks).slice(0, limit);
    };
    return getValidTracks();
}


export async function getTrackData(id) {
    try {
        const response = await fetchWebApi(`tracks/${id}`)
        return response
    } catch (error){
        console.error('Failed to fetch tracks :', error);
        return [];
    }
}

export async function getTopMixes() {
    try {
        const response = await fetchWebApi('search?q=topmixes&type=playlist&limit=9')

        return response.playlists.items;
    } catch (error) {
        console.error('Error fetching playlists:', error);
        return [];
    }
}

export async function getTracksData(playlist_id) {
    const responsePreviewPlaylistData = await fetchWebApi(`playlists/${playlist_id}`);

    const formattedPreviewPlaylistData = {
        owner: responsePreviewPlaylistData.owner.display_name,
        name: responsePreviewPlaylistData.name,
        image: responsePreviewPlaylistData.images[0].url
    };

    const fetchTracks = async (currentOffset) => {
        try {
            const response = await fetchWebApi(`playlists/${playlist_id}/tracks?locale=en_US&limit=100&offset=${currentOffset}`);
            return response.items;
        } catch (error) {
            console.error('Failed to fetch tracks from playlists:', error);
            return [];
        }
    };

    let allTracks = [];
    let currentOffset = 0;
    let hasNullPreviewUrl = true;

    while (hasNullPreviewUrl) {
        const tracks = await fetchTracks(currentOffset);
        if (tracks.length === 0) break;

        const validTracks = tracks
            .filter(item => item.track.preview_url !== null)
            .map(item => item.track);

        allTracks = allTracks.concat(validTracks);

        hasNullPreviewUrl = tracks.some(item => item.track.preview_url === null);

        currentOffset += 100;
    }

    return {
        mixes_data: formattedPreviewPlaylistData,
        tracks: allTracks
    };
}

export async function AnalysisData(trackId) {
    try {
        const response = await fetchWebApi(`audio-analysis/${trackId}`)
        return response
    } catch (error) {
        console.error('Error fetching audio analysis data', error);
    }
}

export async function getRecommended(trackId) {
    try {
        const response = await fetchWebApi(`recommendations?seed_tracks=${trackId}`)
        const formatedData =  response.tracks.map(track => ({
            id: track.id,
            artists: track.artists.map(artist => artist.name).join(', '),
            name: track.name,
            image: track.album.images[2].url
        }))

        return formatedData
    } catch (error) {
        console.error('Error fetching recommended data', error);
    }
}

export async function getSearchData(query, types, offset = 0, limit = 12) {
    try {
        const response = await fetchWebApi(`search?q=${query}&type=${types.join('%2C')}&include_external=audio&offset=${offset}&limit=${limit}`);

        return types.reduce((acc, type) => {
            return {
                ...acc,
                [`${type}s`]: response[`${type}s`].items
            }
        }, {})
    } catch (error) {
        console.error('Error fetching search data', error);
        return {
            artists: [],
            playlists: [],
            tracks: []
        };
    }
}

const types = {
    artist: {
        updatePath: 'top-tracks',
        resolveResponse: (response) => {
            return {
                tracks: response.tracks.map(elem => ({
                    artists: elem.album.artists.map(artist => artist.name).join(', '),
                    image: elem.album.images[2].url,
                    name: elem.name,
                    audio: elem.preview_url || null
                }))
            }
        }
    },
    playlist: {
        updatePath: 'tracks',
        resolveResponse: (response) => {
            return {
                tracks: response.items.map(elem => ({
                    artists: elem.track.artists.map(artist => artist.name).join(', '),
                    image: elem.track.album.images[2].url,
                    name: elem.track.name,
                    audio: elem.track.preview_url
                }))
            }
        }
    },
    track: {
        updatePath: '',
        resolveResponse: (response) => {
            return {
                tracks: [
                    {
                        artists: response.artists.map(artist => artist.name).join(', '),
                        image: response.album.images[2].url,
                        name: response.name,
                        audio: response.preview_url || null
                    }
                ]
            }
        }
    }
}

export async function getModalMusicData(obj) {
    const {id, type} = obj
    const {updatePath, resolveResponse} = types[type];

    try {
        const response = await fetchWebApi(`${type}s/${id}/${updatePath}`);

        return resolveResponse(response);
    } catch (error){
        console.error('Error fetching data', error);
        return {
            response: []
        }
    }
}