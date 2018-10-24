import Chance from 'chance';

const chance = new Chance();

export const createRandomImage = () => ({
    image: {
        filename: chance.string()
    }
});

export const createRandomUser = () => ({
    email: chance.string(),
    isAdmin: chance.bool()
});