import React, {Component} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';

import {darkFontStyles} from '../constants/font-styles';
import {lightFont} from '../constants/style-variables';
import {openHRLink, openMcMenaminLink} from '../services/helper-functions';

const styles = StyleSheet.create({
    headerWrapper: {
        marginVertical: 15
    },
    image: {
        height: 'auto',
        width: '40%'
    },
    linkText: {
        color: '#3368FF',
        fontSize: 14,
        fontWeight: '200'
    },
    row: {
        flexDirection: 'row',
        height: '35%',
        marginTop: '5%',
        width: '100%'
    },
    text: {
        color: lightFont,
        fontSize: 14,
        fontWeight: '200'
    },
    textWrapper: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        paddingHorizontal: '2%',
        width: '100%'
    }
});

export default class WeddingInformation extends Component {
    render() {
        return (
            <View>
                <View style={styles.row}>
                    <Image
                        resizeMode={'contain'}
                        source={require('../assets/church.png')}
                        style={styles.image}
                    />
                    <View style={styles.textWrapper}>
                        <View style={styles.headerWrapper}>
                            <Text style={darkFontStyles.regular}>{'The Ceremony'}</Text>
                        </View>
                        <Text style={styles.text}>{'Holy Rosary Church'}</Text>
                        <Text style={styles.text}>{'May 28th, 2019 at 2PM'}</Text>
                        <Touchable onPress={openHRLink}>
                            <View
                                style={{
                                    alignItems: 'center',
                                    paddingTop: '5%'
                                }}
                            >
                                <Text style={styles.linkText}>{'375 NE Clackamas St.'}</Text>
                                <Text style={styles.linkText}>{'Portland, OR 97232'}</Text>
                            </View>
                        </Touchable>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.textWrapper}>
                        <View style={styles.headerWrapper}>
                            <Text style={darkFontStyles.regular}>{'The Reception'}</Text>
                        </View>
                        <Text style={styles.text}>{'McMenamin\'s Cornelius Pass'}</Text>
                        <Text style={styles.text}>{'May 28th, 2019 at 3:30PM'}</Text>
                        <Touchable onPress={openMcMenaminLink}>
                            <View
                                style={{
                                    alignItems: 'center',
                                    paddingTop: '5%'
                                }}
                            >
                                <Text style={styles.linkText}>{'4045 NE Cornelius Pass Rd.'}</Text>
                                <Text style={styles.linkText}>{'Hillsboro, OR 97124'}</Text>
                            </View>
                        </Touchable>
                    </View>
                    <Image
                        resizeMode={'contain'}
                        source={require('../assets/cake.png')}
                        style={styles.image}
                    />
                </View>
            </View>
        );
    }
}
