import React, {Component} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import * as Progress from 'react-native-progress';

import {darkFontStyles} from '../constants/font-styles';

const styles = StyleSheet.create({
    centeredRow: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    innerWrapper: {
        height: '15%',
        justifyContent: 'space-between'
    },
    wrapper: {
        alignItems: 'center',
        flexDirection: 'column',
        height: '50%',
        justifyContent: 'space-evenly',
        marginTop: '30%'
    }
});

export default class LoadingView extends Component {
    render() {
        let percentage = 0;

        const {
            progresses,
            totals,
            numFinished,
            numToUpload
        } = this.props;

        if (numToUpload) {
            const total = Object.keys(totals).reduce((accum, key) => accum + totals[key], 0);
            const progress = Object.keys(progresses).reduce((accum, key) => accum + progresses[key], 0);

            percentage = total ? progress / total : 0;
        }

        return (
            <View style={styles.wrapper}>
                <ActivityIndicator
                    color={'#678da2'}
                    size={'large'}
                />
                {numToUpload ?
                    <View style={styles.innerWrapper}>
                        <View style={styles.centeredRow}>
                            <Text style={darkFontStyles.regular}>
                                {`Uploading ${numFinished + 1}/${numToUpload}...`}
                            </Text>
                        </View>
                        <Progress.Bar
                            borderColor={'#678da2'}
                            color={'#678da2'}
                            progress={percentage}
                            width={200}
                        />
                    </View>
                    : null}
            </View>
        );
    }
}
