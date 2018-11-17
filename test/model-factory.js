import Chance from 'chance';

const chance = new Chance();

export const createRandomImage = () => ({
    image: {
        filename: chance.string(),
        height: chance.natural({
            max: 10,
            min: 1
        }),
        uri: chance.string(),
        width: chance.natural({
            max: 10,
            min: 1
        })
    }
});

export const createRandomUser = () => ({
    email: chance.string(),
    isAdmin: chance.bool()
});

export const createRandomPicture = () => ({
    dimension: {
        height: chance.natural(),
        width: chance.natural()
    },
    name: chance.string(),
    source: {
        uri: chance.string()
    }
});

export const createRandomEvent = (event = {}) => ({
    eventId: chance.guid(),
    eventName: chance.string(),
    primaryAdmin: chance.string(),
    ...event
});
