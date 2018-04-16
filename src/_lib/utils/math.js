export const mod = (m, n) => {
    return ((m % n) + n) % n;
};

export const random = (min, max) => {
    return (Math.random() * (max - min)) + min;
};
