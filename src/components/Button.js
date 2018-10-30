import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import Touchable from 'react-native-platform-touchable';

import {whiteFontStyles} from '../constants/font-styles';

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#678da2',
        borderColor: '#678da2',
        borderRadius: 10,
        borderWidth: 1,
        justifyContent: 'center',
        width: '100%'
    },
    centeredRow: {
        flexDirection: 'row',
        justifyContent: 'center'
    }
});

export default class Button extends Component {
    render() {
        const {action, fontSize, height, text, width} = this.props;

        return (
            <View style={styles.centeredRow}>
                <Touchable
                    onPress={action}
                >
                    <View
                        style={[styles.button, {
                            paddingHorizontal: width,
                            paddingVertical: height
                        }]}
                    >
                        <Text
                            style={[
                                whiteFontStyles.regular,
                                {fontSize}
                            ]}
                        >
                            {text}
                        </Text>
                    </View>
                </Touchable>
            </View>
        );
    }
}
