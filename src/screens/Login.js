import React from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, TextInput, View} from 'react-native';
import {Navigation} from 'react-native-navigation';

import Button from '../components/Button';
import {lightFont} from '../constants/style-variables';
import RequestAccess from '../components/RequestAccess';
import {redFontStyles} from '../constants/font-styles';

const styles = StyleSheet.create({
    image: {
        height: '50%',
        width: '50%'
    },
    textInputStyle: {
        color: lightFont,
        fontSize: 18,
        fontWeight: '200',
        width: '100%'
    },
    textInputWrapper: {
        flexDirection: 'row',
        width: '80%'
    },
    textWrapper: {
        alignItems: 'flex-start',
        flexDirection: 'column',
        height: '15%',
        justifyContent: 'space-evenly',
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
            topBar: {
                title: {
                    text: this.props.event.eventName
                }
            }
        });
        this.props.actions.setUsers();
    }

    render() {
        const {actions, failedLogin, event, user, users} = this.props;

        return (
            <View style={styles.wrapperView}>
                <View style={styles.textWrapper}>
                    <View style={styles.textInputWrapper}>
                        <TextInput
                            autoCapitalize={'none'}
                            onChangeText={(email) => actions.setEmail(email.toLowerCase())}
                            placeholder={'Email'}
                            style={styles.textInputStyle}
                            testID={'emailInput'}
                            value={user.email}
                        />
                    </View>
                    <View style={styles.textInputWrapper}>
                        <TextInput
                            autoCapitalize={'words'}
                            onChangeText={(name) => actions.setName(name)}
                            placeholder={'Name'}
                            style={styles.textInputStyle}
                            testID={'nameInput'}
                            value={user.name}
                        />
                    </View>
                </View>
                {
                    users ?
                        <View
                            style={{paddingTop: 20}}
                            testID={'loginButton'}
                        >
                            <Button
                                action={actions.login}
                                fontSize={30}
                                height={15}
                                text={'LOGIN'}
                                width={80}
                            />
                        </View>
                        :
                        <ActivityIndicator />
                }
                {
                    failedLogin &&
                        <Text
                            style={[redFontStyles.light, {paddingTop: 20}]}
                            testID={'notAuthorizedText'}
                        >
                            {'Email not authorized'}
                        </Text>
                }
                <RequestAccess />
                {
                    event.eventName === 'Dominic & Mary' &&
                    <Image
                        resizeMode={'contain'}
                        source={require('../assets/D&M-logo.png')}
                        style={styles.image}
                    />
                }
            </View>
        );
    }
}
