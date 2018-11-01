import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';

import {logout} from '../services/helper-functions';
import Button from '../components/Button';
import {green, lightFont} from '../constants/style-variables';
import Feather from 'react-native-vector-icons/Feather';

const styles = StyleSheet.create({
    userButtonWrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 20,
        width: '100%'
    },
    userText: {
        color: lightFont,
        flex: 1,
        fontSize: 15,
        fontWeight: '200'
    },
    userWrapper: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        marginBottom: 10
    }
});

export default class More extends Component {
    render() {
        const {actions, user} = this.props;

        return (
            <View style={{flex: 1}}>
                <View style={styles.userWrapper}>
                    <Text style={styles.userText}>
                        {user.name !== '' ?
                            `${user.name} - ${user.email}`
                            :
                            user.email
                        }
                    </Text>
                </View>
                {
                    user.isAdmin &&
                    <View style={styles.userButtonWrapper}>
                        <Touchable onPress={actions.toggleUserModal}>
                            <Feather
                                color={green}
                                name={'user-plus'}
                                size={80}
                            />
                        </Touchable>
                    </View>
                }
                <Button
                    action={actions.logout}
                    fontSize={15}
                    height={20}
                    text={'LOGOUT'}
                    width={40}
                />
            </View>
        );
    }
}
