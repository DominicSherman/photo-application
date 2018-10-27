import React from 'react';
import Chance from 'chance';
import ShallowRenderer from 'react-test-renderer/shallow';
import {View} from 'react-native';

import Login from '../../src/screens/Login';
import {createRandomUser} from '../model-factory';

const chance = new Chance();

describe('Login', () => {
    let expectedProps,

        renderedComponent;

    const cacheChildren = () => {};

    const renderComponent = () => {
        const shallowRenderer = ShallowRenderer.createRenderer();

        shallowRenderer.render(<Login {...expectedProps} />);

        renderedComponent = shallowRenderer.getRenderOutput();

        cacheChildren();
    };

    beforeEach(() => {
        expectedProps = {
            actions: {
                setEmail: jest.fn(),
                setName: jest.fn(),
                toggleUserModal: jest.fn()
            },
            user: createRandomUser(),
            users: chance.n(createRandomUser, chance.d6() + 1)
        };

        renderComponent();
    });

    it('should render a root View', () => {
        expect(renderedComponent.type).toBe(View);
    });
});
