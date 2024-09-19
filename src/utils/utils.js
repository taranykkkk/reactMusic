export const formatTime = (timeInSeconds = 29) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
};

export const isObjectNotEmpty = (obj) => {
    const isEmpty = !obj.id && obj.images.length === 0 && !obj.name && !obj.artists && !obj.audio;
    return !isEmpty;
}

export const isObjectNotEmptyV2 = (obj) => {
    const isEmpty = !obj.id && !obj.type
    return !isEmpty
}

