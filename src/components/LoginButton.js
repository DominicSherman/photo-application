import React, {Component} from 'react';
import Touchable from 'react-native-platform-touchable';
import {Text, View, StyleSheet} from 'react-native';

import {darkFontStyles} from '../constants/font-styles';

export default class LoginButton extends Component {
    render() {
        return (
            <View style={styles.centeredRow}>
                <Touchable onPress={this.props.login}>
                    <View style={styles.buttonView}>
                        <Text
                            style={[
                                darkFontStyles.regular,
                                {color: 'white', fontSize: 30}
                            ]}
                        >
                            {'LOGIN'}
                        </Text>
                    </View>
                </Touchable>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttonView: {
        width: '100%',
        paddingVertical: 40,
        paddingHorizontal: 80,
        borderColor: '#678da2',
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: '#678da2',
        justifyContent: 'center'
    },
    centeredRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 50
    }
});