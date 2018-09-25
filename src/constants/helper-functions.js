export const getCurrentTime = () => {
    const today = new Date();
    const minutes = today.getMinutes() < 10 ? `0${today.getMinutes()}` : today.getMinutes();
    const seconds = today.getSeconds() < 10 ? `0${today.getSeconds()}` : today.getSeconds();

    return `${today.getMonth()+1}-${today.getDate()}-${today.getFullYear()} ${today.getHours()}:${minutes}:${seconds}`;
};

export const getTimeForDisplay = (duration) => {
    const min = Math.floor(duration / 60);
    const sec = (duration % 60) < 10 ? `0${(duration % 60)}` : (duration % 60);

    return `${min}:${sec}`;
};

export const clean = (string) => string.replace(/[^a-zA-Z0-9]/g, '');