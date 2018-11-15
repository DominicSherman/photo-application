import React, {Component} from 'react';
import {StyleSheet, Switch, Text, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import Feather from 'react-native-vector-icons/Feather';

import Button from '../components/Button';
import {green} from '../constants/style-variables';
import {USER_MODAL} from '../constants/routes';
import {showModal} from '../services/navigation-service';
import {darkFontStyles, lightFontStyles} from '../constants/font-styles';
import {PROD} from '../constants/variables';

const styles = StyleSheet.create({
    adminWrapper: {
        alignItems: 'center',
        flex: 0.3,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        width: '100%'
    },
    switchWrapper: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '50%'
    },
    userWrapper: {
        alignItems: 'center',
        flex: 0.2,
        justifyContent: 'space-evenly',
        marginBottom: '5%'
    }
});

export default class More extends Component {
    constructor(props) {
        super(props);

        this.state = {
            numPresses: 0
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.env !== this.props.env) {
            this.props.actions.setUsers();
        }
    }

    incrementPresses = () => this.setState({numPresses: this.state.numPresses + 1});

    render() {
        const {actions, env, user} = this.props;

        return (
            <View style={{flex: 1}}>
                <View style={styles.userWrapper}>
                    <Text
                        onPress={this.incrementPresses}
                        style={darkFontStyles.regular}
                    >
                        {user.name}
                    </Text>
                    <Text style={darkFontStyles.regular}>{user.email}</Text>
                </View>
                {
                    user.isAdmin &&
                    <View style={styles.adminWrapper}>
                        <Touchable
                            onPress={() => showModal(USER_MODAL)}
                        >
                            <Feather
                                color={green}
                                name={'user-plus'}
                                size={80}
                            />
                        </Touchable>
                        {this.state.numPresses >= 10 &&
                            <View style={styles.switchWrapper}>
                                <Text style={lightFontStyles.light}>{'DEV'}</Text>
                                <Switch
                                    onValueChange={actions.toggleEnv}
                                    testID={'changeEnvSwitch'}
                                    value={env === PROD}
                                />
                                <Text style={lightFontStyles.light}>{'PROD'}</Text>
                            </View>
                        }
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
