import React from 'react';
import Chance from 'chance';
import {Text, View, Linking, Platform} from 'react-native';
import Mailer from 'react-native-mail';
import ShallowRenderer from 'react-test-renderer/shallow';

import RequestAccess from '../../src/components/RequestAccess';
import {createRandomEvent} from '../model-factory';

const chance = new Chance();

describe('RequestAccess', () => {
    let expectedProps,

        renderedComponent,

        renderedText,

        renderedTextChild,
        renderedRequestText;

    const cacheChildren = () => {
        renderedText = renderedComponent.props.children;

        [
            renderedTextChild,
            renderedRequestText
        ] = renderedText.props.children;
    };

    const renderComponent = () => {
        const shallowRenderer = ShallowRenderer.createRenderer();

        shallowRenderer.render(<RequestAccess {...expectedProps} />);

        renderedComponent = shallowRenderer.getRenderOutput();

        cacheChildren();
    };

    beforeEach(() => {
        expectedProps = {
            event: createRandomEvent(),
            primaryAdmin: chance.string()
        };
        Linking.openUrl = jest.fn();

        renderComponent();
    });

    it('should render a root View', () => {
        expect(renderedComponent.type).toBe(View);
    });

    it('should render don\'t have access text wrapper', () => {
        expect(renderedText.type).toBe(Text);
        expect(renderedTextChild).toBe('Don\'t have access? ');
    });

    it('should render request text', () => {
        expect(renderedRequestText.type).toBe(Text);
        expect(renderedRequestText.props.children).toBe('Request it');
    });

    it('should handle the press on Android', async () => {
        Platform.OS = 'android';
        await renderedRequestText.props.onPress();

        expect(Linking.openURL).toHaveBeenCalledTimes(1);
        expect(Linking.openURL).toHaveBeenCalledWith(`mailto:${expectedProps.primaryAdmin}?subject=PikCloud Access&body=Requesting access for: `);
    });

    it('should handle the press on iOS', async () => {
        Platform.OS = 'ios';
        await renderedRequestText.props.onPress();

        expect(Mailer.mail).toHaveBeenCalledTimes(1);
        expect(Mailer.mail).toHaveBeenCalledWith({
            body: '<b>Requesting access for </b>',
            isHTML: true,
            recipients: [expectedProps.primaryAdmin],
            subject: `PikCloud access to ${expectedProps.event.eventName}`
        }, expect.any(Function));
    });
});
