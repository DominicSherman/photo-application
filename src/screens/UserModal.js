import React from 'react';
import {FlatList, SafeAreaView, StyleSheet, Switch, Text, TextInput, View, Linking} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import {darkFontStyles} from '../constants/font-styles';
import Button from '../components/Button';
import {addUser} from '../services/firebase-service';
import {dismissModal} from '../services/navigation-service';
import {lightFont} from '../constants/style-variables';

const styles = StyleSheet.create({
    currentUsers: {
        alignItems: 'center',
        flex: 1,
        paddingTop: 20,
        width: '100%'
    },
    header: {
        alignContent: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 10
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: '5%',
        paddingVertical: 5,
        width: '90%'
    },
    switch: {
        flex: 0.1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: '4%',
        width: '40%'
    },
    textInputStyle: {
        color: lightFont,
        fontSize: 25,
        fontWeight: '200',
        width: '100%'
    },
    textInputWrapper: {
        flexDirection: 'row',
        width: '90%'
    },
    wrapperView: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly'
    }
});

export default class UserModal extends React.Component {
    constructor(props) {
        super(props);

        this.initalState = {
            email: '',
            isAdmin: false
        };

        this.state = this.initalState;
    }

    componentDidMount() {
        this.props.actions.setUsers();
    }

    resetState = () => this.setState(this.initalState);

    setEmail = (email) => this.setState({email});

    setIsAdmin = (isAdmin) => this.setState({isAdmin});

    render() {
        const {env, users, event} = this.props;
        const {email, isAdmin} = this.state;

        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.header}>
                    <Touchable
                        onPress={() => dismissModal(this.props.componentId)}
                    >
                        <EvilIcons
                            name={'close'}
                            size={30}
                        />
                    </Touchable>
                </View>
                <View style={styles.wrapperView}>
                    <View style={styles.textInputWrapper}>
                        <TextInput
                            autoCapitalize={'none'}
                            clearTextOnFocus
                            numberOfLines={2}
                            onChangeText={(inputEmail) => this.setEmail(inputEmail.toLowerCase())}
                            placeholder={'Email'}
                            style={styles.textInputStyle}
                            value={email}
                        />
                    </View>
                    <View style={styles.switch}>
                        <Text style={darkFontStyles.regular}>{'Admin'}</Text>
                        <Switch
                            onValueChange={(inputIsAdmin) => this.setIsAdmin(inputIsAdmin)}
                            value={isAdmin}
                        />
                    </View>
                    <Button
                        action={() => {
                            addUser(event.eventId, email, isAdmin, env);
                            Linking.openURL(`mailto:${email.toLowerCase()}?subject=RE: DMPhotos Access&body=Access granted`);
                            this.resetState();
                        }}
                        fontSize={25}
                        height={18}
                        text={'ADD'}
                        width={50}
                    />
                    <View style={styles.currentUsers}>
                        <Text style={[darkFontStyles.medium, {fontSize: 25}]}>{'Current Users'}</Text>
                        <View style={styles.row}>
                            <Text style={[darkFontStyles.medium, {fontSize: 15}]}>{'EMAIL'}</Text>
                            <Text style={[darkFontStyles.medium, {fontSize: 15}]}>{'ADMIN'}</Text>
                        </View>
                        <FlatList
                            data={users}
                            keyExtractor={(user) => user.email}
                            renderItem={({item}) => (
                                <View style={styles.row}>
                                    <Text
                                        numberOfLines={1}
                                        style={[darkFontStyles.regular, {
                                            fontSize: 15,
                                            width: '90%'
                                        }]}
                                    >
                                        {item.email}
                                    </Text>
                                    <Text
                                        style={[darkFontStyles.regular, {fontSize: 15}]}
                                    >
                                        {item.isAdmin ? 'Yes' : 'No'}
                                    </Text>
                                </View>
                            )}
                        />
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}
