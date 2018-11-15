import React, {Component} from 'react';
import {Text, View, StyleSheet, Linking} from 'react-native';

import {darkFontStyles, redFontStyles} from '../constants/font-styles';

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        paddingTop: '5%'
    }
});

export default class RequestAccess extends Component {
    render() {
        const {primaryAdmin} = this.props;

        return (
            <View style={styles.wrapper}>
                <Text style={darkFontStyles.light}>
                    {'Don\'t have access? '}
                    <Text
                        onPress={() =>
                            Linking.openURL(`mailto:${primaryAdmin}?subject=DMPhotos Access&body=Requesting access for: `)
                        }
                        style={redFontStyles.regular}
                    >
                        {'Request it'}
                    </Text>
                </Text>
            </View>
        );
    }
}
