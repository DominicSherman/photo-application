import React from 'react';
import {TextInput, View, StyleSheet, Text} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import {darkFontStyles, lightFontStyles} from '../constants/font-styles';

export default class Login extends React.Component {
    render() {
        const {actions, user: {email, name}} = this.props;

        return (
            <View
                style={styles.wrapperView}
            >
                <TextInput
                    autoCapitalize={false}
                    clearTextOnFocus
                    style={lightFontStyles.light}
                    onChangeText={(email) => actions.setEmail(email)}
                    placeholder={'Email'}
                    value={email}
                />
                <TextInput
                    clearTextOnFocus
                    style={lightFontStyles.light}
                    onChangeText={(name) => actions.setName(name)}
                    placeholder={'Name'}
                    value={name}
                />
                <Touchable onPress={() => {
                    actions.login();
                }}>
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
        justifyContent: 'center',
        marginTop: '10%',
        alignItems: 'center'
    },
    wrapperView: {
        marginTop: '40%',
        justifyContent: 'space-between',
        flexDirection: 'column',
        alignItems: 'center',
        height: '60%'
    }
});