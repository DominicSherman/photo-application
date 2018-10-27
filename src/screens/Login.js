import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';

import {lightFontStyles} from '../constants/font-styles';
import Button from '../components/Button';
import {login} from '../services/helper-functions';

const styles = StyleSheet.create({
    wrapperView: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: '40%'
    }
});

export default class Login extends React.Component {
    render() {
        const {actions, user, users} = this.props;
        const showUserButton = users && !users.length;

        return (
            <View style={[styles.wrapperView, {height: showUserButton ? '75%' : '60%'}]}>
                <TextInput
                    autoCapitalize={'none'}
                    clearTextOnFocus
                    numberOfLines={2}
                    onChangeText={(email) => actions.setEmail(email.toLowerCase())}
                    placeholder={'Email'}
                    style={[lightFontStyles.light, {fontSize: 25}]}
                    value={user.email}
                />
                <TextInput
                    autoCapitalize={'words'}
                    clearTextOnFocus
                    onChangeText={(name) => actions.setName(name)}
                    placeholder={'Name'}
                    style={[lightFontStyles.light, {fontSize: 25}]}
                    value={user.name}
                />
                <Button
                    action={() => login(actions, user, users)}
                    fontSize={30}
                    height={40}
                    text={'LOGIN'}
                    width={80}
                />
                {showUserButton ?
                    <Button
                        action={actions.toggleUserModal}
                        fontSize={25}
                        height={25}
                        text={'USERS'}
                        width={50}
                    />
                    :
                    null
                }
            </View>
        );
    }
}
