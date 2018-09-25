import React, {Component} from 'react';
import {whiteFontStyles} from '../constants/font-styles';
import {Text, View, StyleSheet} from 'react-native';
import Touchable from 'react-native-platform-touchable';

export default class Button extends Component {
    render() {
        const {action, text, fontSize, height, width} = this.props;
        return (
            <View style={styles.centeredRow}>
                <Touchable
                    onPress={action}
                >
                    <View
                        style={[
                            styles.button,
                            {
                                paddingVertical: height,
                                paddingHorizontal: width
                            }
                        ]}
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

const styles = StyleSheet.create({
    button: {
        width: '100%',
        borderColor: '#678da2',
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: '#678da2',
        justifyContent: 'center'
    },
    centeredRow: {
        justifyContent: 'center',
        flexDirection: 'row'
    }
});