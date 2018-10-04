import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {lightFontStyles} from '../constants/font-styles';
import Button from '../components/Button';
import {login} from '../constants/helper-functions';

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
                    style={[lightFontStyles.light, {fontSize: 25}]}
                    onChangeText={(email) => actions.setEmail(email.toLowerCase())}
                    placeholder={'Email'}
                    value={user.email}
                />
                <TextInput
                    autoCapitalize={'words'}
                    clearTextOnFocus
                    style={[lightFontStyles.light, {fontSize: 25}]}
                    onChangeText={(name) => actions.setName(name)}
                    placeholder={'Name'}
                    value={user.name}
                />
                <Button
                    action={() => login(actions, user, users)}
                    text={'LOGIN'}
                    fontSize={30}
                    height={40}
                    width={80}
                />
                {showUserButton ?
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
        alignItems: 'center'
    }
});