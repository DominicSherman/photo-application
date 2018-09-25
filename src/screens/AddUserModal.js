import React from 'react';
import {Modal, SafeAreaView, StyleSheet, Switch, Text, TextInput, View} from 'react-native';
import Touchable from 'react-native-platform-touchable'
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import {darkFontStyles, lightFontStyles} from '../constants/font-styles';
import Button from '../components/Button';
import {addUser} from '../services/firebase-service';

export default class AddUserModal extends React.Component {
    constructor(props) {
        super(props);

        this.initalState = {
            email: '',
            isAdmin: false,
        };

        this.state = this.initalState;
    }

    resetState = () => this.setState(this.initalState);

    render() {
        const {actions, userModalVisible} = this.props;
        const {email, isAdmin} = this.state;
        console.log('this.state', this.state);

        return (
            <Modal
                animationType={'slide'}
                transparent={false}
                visible={userModalVisible}
            >
                <SafeAreaView>
                    <View style={styles.header}>
                        <Touchable
                            onPress={actions.toggleUserModal}
                        >
                            <EvilIcons
                                name={'close'}
                                size={30}
                            />
                        </Touchable>
                    </View>
                    <View style={styles.wrapperView}>
                        <TextInput
                            autoCapitalize={'none'}
                            clearTextOnFocus
                            numberOfLines={2}
                            style={[lightFontStyles.light, {fontSize: 25}]}
                            onChangeText={(email) => this.setState({email})}
                            placeholder={'Email'}
                            value={email}
                        />
                        <View style={styles.switch}>
                            <Text style={darkFontStyles.regular}>{'Admin'}</Text>
                            <Switch
                                onValueChange={(isAdmin) => this.setState({isAdmin})}
                                value={isAdmin}
                            />
                        </View>
                        <Button
                            action={() => {
                                addUser(email.toLowerCase(), isAdmin);
                                this.resetState();
                            }}
                            text={'ADD'}
                            fontSize={25}
                            height={25}
                            width={50}
                        />
                    </View>
                </SafeAreaView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 10,
        alignContent: 'center'
    },
    switch: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '40%'
    },
    wrapperView: {
        marginTop: '40%',
        justifyContent: 'space-between',
        flexDirection: 'column',
        alignItems: 'center',
        height: '50%'
    }
});