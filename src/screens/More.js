import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import Feather from 'react-native-vector-icons/Feather';

import Button from '../components/Button';
import {green} from '../constants/style-variables';
import {USER_MODAL} from '../constants/routes';
import {showModal} from '../services/navigation-service';
import {darkFontStyles} from '../constants/font-styles';

const styles = StyleSheet.create({
    userButtonWrapper: {
        flex: 0.3,
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%'
    },
    userWrapper: {
        alignItems: 'center',
        flex: 0.2,
        justifyContent: 'space-evenly',
        marginBottom: '5%'
    }
});

export default class More extends Component {
    render() {
        const {actions, user} = this.props;

        return (
            <View style={{flex: 1}}>
                <View style={styles.userWrapper}>
                    <Text style={darkFontStyles.regular}>{user.name}</Text>
                    <Text style={darkFontStyles.regular}>{user.email}</Text>
                </View>
                {
                    user.isAdmin &&
                    <View style={styles.userButtonWrapper}>
                        <Touchable
                            onPress={() => showModal(USER_MODAL)}
                        >
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
