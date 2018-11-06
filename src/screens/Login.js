import React from 'react';
import {ActivityIndicator, Image, StyleSheet, TextInput, View} from 'react-native';
import {Navigation} from 'react-native-navigation';

import {lightFontStyles} from '../constants/font-styles';
import Button from '../components/Button';

const styles = StyleSheet.create({
    image: {
        height: '75%',
        width: '75%'
    },
    textWrapper: {
        alignItems: 'flex-start',
        flexDirection: 'column',
        height: '12%',
        justifyContent: 'space-between',
        marginBottom: '2%',
        paddingLeft: '16%',
        width: '100%'
    },
    wrapperView: {
        alignItems: 'center',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        marginTop: '25%',
        width: '100%'
    }
});

export default class Login extends React.Component {
    componentDidMount() {
        Navigation.mergeOptions(this.props.componentId, {
            options: {
                bottomTabs: {
                    visible: false
                }
            }
        });
    }

    render() {
        const {actions, user, users} = this.props;

        return (
            <View style={styles.wrapperView}>
                <View style={styles.textWrapper}>
                    <TextInput
                        autoCapitalize={'none'}
                        onChangeText={(email) => actions.setEmail(email.toLowerCase())}
                        placeholder={'Email'}
                        style={[lightFontStyles.light, {fontSize: 18}]}
                        value={user.email}
                    />
                    <TextInput
                        autoCapitalize={'words'}
                        onChangeText={(name) => actions.setName(name)}
                        placeholder={'Name'}
                        style={[lightFontStyles.light, {fontSize: 18}]}
                        value={user.name}
                    />
                </View>
                {
                    users ?
                        <Button
                            action={actions.login}
                            fontSize={30}
                            height={15}
                            text={'LOGIN'}
                            width={80}
                        />
                        :
                        <ActivityIndicator />
                }
                <Image
                    resizeMode={'contain'}
                    source={require('../assets/D&M-logo.png')}
                    style={styles.image}
                />
            </View>
        );
    }
}
