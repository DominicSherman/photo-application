import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {lightFontStyles} from '../constants/font-styles';
import Button from '../components/Button';

export default class Login extends React.Component {
    render() {
        const {actions, user: {email, name}, users} = this.props;

        return (
            <View
                style={styles.wrapperView}
            >
                <TextInput
                    autoCapitalize={'none'}
                    clearTextOnFocus
                    numberOfLines={2}
                    style={[lightFontStyles.light, {fontSize: 25}]}
                    onChangeText={(email) => actions.setEmail(email.toLowerCase())}
                    placeholder={'Email'}
                    value={email}
                />
                <TextInput
                    autoCapitalize={'words'}
                    clearTextOnFocus
                    style={[lightFontStyles.light, {fontSize: 25}]}
                    onChangeText={(name) => actions.setName(name)}
                    placeholder={'Name'}
                    value={name}
                />
                <Button
                    action={actions.login}
                    text={'LOGIN'}
                    fontSize={30}
                    height={40}
                    width={80}
                />
                {users && !users.length ?
                    <Button
                        action={actions.toggleUserModal}
                        text={'USERS'}
                        fontSize={25}
                        height={25}
                        width={50}
                    />
                    :
                    null
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapperView: {
        marginTop: '40%',
        justifyContent: 'space-between',
        flexDirection: 'column',
        alignItems: 'center',
        height: '75%'
    }
});