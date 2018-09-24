import React, {Component} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {darkFontStyles} from '../constants/font-styles';
import * as Progress from 'react-native-progress';
import {withRedux} from '../redux-factory';

class LoadingView extends Component {
    render() {
        const {
            progresses,
            totals,
            numFinished,
            numToUpload
        } = this.props;
        const total = Object.keys(totals).reduce((accum, key) => {
            return (accum + totals[key]);
        }, 0);
        const progress = Object.keys(progresses).reduce((accum, key) => {
            return (accum + progresses[key]);
        }, 0);
        const percentage = total ? progress / total : 0;

        return (
            <View style={styles.wrapper}>
                <ActivityIndicator
                    size={'large'}
                    color={'#678da2'}
                />
                {numToUpload ?
                    <View style={styles.innerWrapper}>
                        <View style={styles.centeredRow}>
                            <Text style={darkFontStyles.regular}>
                                {`Uploading ${numFinished + 1}/${numToUpload}...`}
                            </Text>
                        </View>
                        <Progress.Bar
                            progress={percentage}
                            width={200}
                            color={'#678da2'}
                            borderColor={'#678da2'}
                        />
                    </View>
                    : null}
            </View>
        );
    }
}

export default withRedux(LoadingView);

const styles = StyleSheet.create({
    centeredRow: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    innerWrapper: {
        justifyContent: 'space-between',
        height: '15%'
    },
    wrapper: {
        marginTop: '30%',
        justifyContent: 'space-evenly',
        flexDirection: 'column',
        alignItems: 'center',
        height: '50%'
    }
});