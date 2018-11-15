import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, TextInput, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import Button from '../components/Button';
import {createEvent} from '../services/firebase-service';
import {dismissModal} from '../services/navigation-service';
import {lightFont} from '../constants/style-variables';

const styles = StyleSheet.create({
    header: {
        alignContent: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 10,
        width: '100%'
    },
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
        height: '30%',
        justifyContent: 'space-between',
        paddingLeft: '16%',
        width: '100%'
    },
    wrapperView: {
        alignItems: 'center',
        flexDirection: 'column',
        height: '50%',
        justifyContent: 'space-evenly',
        width: '100%'
    }
});

export default class CreateEventModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            eventName: '',
            primaryAdmin: ''
        };
    }

    setEventName = (eventName) => this.setState({eventName});

    setPrimaryAdmin = (primaryAdmin) => this.setState({primaryAdmin});

    render() {
        return (
            <SafeAreaView>
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
                    <View style={styles.textWrapper}>
                        <View style={styles.textInputWrapper}>
                            <TextInput
                                autoCapitalize={'words'}
                                onChangeText={(eventName) => this.setEventName(eventName)}
                                placeholder={'Event Name'}
                                style={styles.textInputStyle}
                                value={this.state.eventName}
                            />
                        </View>
                        <View style={styles.textInputWrapper}>
                            <TextInput
                                autoCapitalize={'none'}
                                onChangeText={(primaryAdmin) => this.setPrimaryAdmin(primaryAdmin.toLowerCase())}
                                placeholder={'Admin'}
                                style={styles.textInputStyle}
                                value={this.state.primaryAdmin}
                            />
                        </View>
                    </View>
                    <Button
                        action={() => {
                            if (this.state.eventName !== '' && this.state.primaryAdmin !== '') {
                                createEvent(this.props.env, this.state.eventName, this.state.primaryAdmin);
                                dismissModal(this.props.componentId);
                            }
                        }}
                        fontSize={30}
                        height={15}
                        text={'Create'}
                        width={80}
                    />
                </View>
            </SafeAreaView>
        );
    }
}
