import React, {Component} from 'react';
import {FlatList, StyleSheet, Switch, Text, View, Alert} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import {Navigation} from 'react-native-navigation';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import {lightFontStyles, whiteFontStyles} from '../constants/font-styles';
import Button from '../components/Button';
import {goToRoute, showModal} from '../services/navigation-service';
import {CREATE_EVENT, LOGIN} from '../constants/routes';
import {PROD} from '../constants/variables';

import LoadingView from './LoadingView';
import {white} from '../constants/style-variables';

const styles = StyleSheet.create({
    eventsEmpty: {
        alignItems: 'center',
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        padding: '10%',
        width: '100%'
    },
    eventView: {
        alignItems: 'center',
        borderColor: '#678da2',
        borderRadius: 10,
        borderWidth: 1,
        margin: '5%',
        padding: '2%'
    },
    header: {
        alignContent: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10
    },
    switchWrapper: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '50%'
    },
    wrapperView: {
        alignItems: 'center',
        backgroundColor: white,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%'
    }
});

export default class SelectEvent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            numPresses: 0
        };
    }

    componentDidMount() {
        Navigation.mergeOptions(this.props.componentId, {
            topBar: {
                title: {
                    text: 'Select Event'
                }
            }
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.env !== this.props.env) {
            this.props.actions.setEvents();
        }
    }

    incrementPresses = () => this.setState({numPresses: this.state.numPresses + 1});

    render() {
        const {actions, componentId, event, events, env} = this.props;

        if (!events) {
            return <LoadingView />;
        }

        return (
            <View style={styles.wrapperView}>
                <Touchable
                    onPress={this.incrementPresses}
                >
                    <Text style={whiteFontStyles.regular}>{'Admin Button'}</Text>
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
                <FlatList
                    ListEmptyComponent={
                        <View style={styles.eventsEmpty}>
                            <Text style={lightFontStyles.regular}>{'No events created'}</Text>
                        </View>
                    }
                    ListFooterComponent={
                        <View style={{paddingTop: '10%'}}>
                            <Button
                                action={() => showModal(CREATE_EVENT)}
                                fontSize={30}
                                height={15}
                                text={'Create Event'}
                                width={50}
                            />
                        </View>
                    }
                    data={events}
                    extraData={event}
                    keyExtractor={(item) => item.eventId}
                    renderItem={({item}) =>
                        <View>
                            <Touchable
                                onPress={() => {
                                    actions.setEvent(item);
                                    goToRoute(LOGIN, componentId);
                                }}
                                testID={item.eventId}
                            >
                                <View style={styles.eventView}>
                                    <Text style={lightFontStyles.light}>{item.eventName}</Text>
                                </View>
                            </Touchable>
                            {
                                this.state.numPresses >= 10 &&
                                <View
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '100%'
                                    }}
                                >
                                    <Touchable
                                        onPress={() =>
                                            Alert.alert(
                                                'Are you sure?',
                                                item.eventName,
                                                [
                                                    {text: 'Cancel'},
                                                    {
                                                        onPress: () => actions.deleteEvent(item.eventId),
                                                        text: 'Yes'
                                                    }
                                                ]
                                            )
                                        }
                                    >
                                        <EvilIcons
                                            name={'minus'}
                                            size={20}
                                        />
                                    </Touchable>
                                </View>
                            }
                        </View>
                    }
                />
            </View>
        );
    }
}
