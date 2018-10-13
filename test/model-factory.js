import Chance from 'chance';

const chance = new Chance();

export const createRandomImage = (image) => ({
    image: {
        filename: chance.string()
    },
    ...image
});