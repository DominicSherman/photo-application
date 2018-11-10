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
        return (
            <View style={styles.wrapper}>
                <Text style={darkFontStyles.light}>
                    {'Don\'t have access? '}
                    <Text
                        onPress={() =>
                            Linking.openURL('mailto:dominic.sherman98@gmail.com?subject=DMPhotos Access&body=Requesting access for: ')
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
