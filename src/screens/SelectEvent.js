import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import {Navigation} from 'react-native-navigation';

import {lightFontStyles} from '../constants/font-styles';
import Button from '../components/Button';
import {goToRoute, showModal} from '../services/navigation-service';
import {CREATE_EVENT, LOGIN} from '../constants/routes';

import LoadingView from './LoadingView';
import {getDefaultOptions} from '../services/layout-factory';

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
    wrapperView: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%'
    }
});

export default class SelectEvent extends Component {
    componentDidMount() {
        Navigation.mergeOptions(this.props.componentId, {
            topBar: {
                title: {
                    text: 'Select Event'
                }
            }
        });
    }

    render() {
        const {actions, componentId, event, events} = this.props;

        return (
            events ?
                <View style={styles.wrapperView}>
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
                            <Touchable
                                onPress={() => {
                                    actions.setEvent(item);
                                    goToRoute(LOGIN, componentId);
                                }}
                            >
                                <View style={styles.eventView}>
                                    <Text style={lightFontStyles.light}>{item.eventName}</Text>
                                </View>
                            </Touchable>
                        }
                    />
                </View>
                :
                <LoadingView />
        );
    }
}
