import React, {Component} from 'react';
import {Linking, Platform, StyleSheet, Text, View} from 'react-native';
import Mailer from 'react-native-mail';

import {darkFontStyles, redFontStyles} from '../constants/font-styles';

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        paddingTop: '5%'
    }
});

export default class RequestAccess extends Component {
    handleEmail = async () => {
        const {primaryAdmin, event: {eventName}} = this.props;

        if (Platform.OS === 'ios') {
            await Mailer.mail({
                body: '<b>Requesting access for </b>',
                isHTML: true,
                recipients: [primaryAdmin],
                subject: `PikCloud access to ${eventName}`
            }, () => ({}));
        } else {
            Linking.openURL(`mailto:${primaryAdmin}?subject=PikCloud Access&body=Requesting access for: `);
        }
    };

    render() {
        return (
            <View style={styles.wrapper}>
                <Text style={darkFontStyles.light}>
                    {'Don\'t have access? '}
                    <Text
                        onPress={this.handleEmail}
                        style={redFontStyles.regular}
                    >
                        {'Request it'}
                    </Text>
                </Text>
            </View>
        );
    }
}
