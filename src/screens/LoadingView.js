import React, {Component} from 'react';
import {black} from '../constants/style-variables';
import {ActivityIndicator, Text, View} from 'react-native';
import {darkFontStyles} from '../constants/font-styles';
import * as Progress from 'react-native-progress';

export default class LoadingView extends Component {
    render() {
        const {progresses, totals, numFinished, numToUpload} = this.props;
        const total = Object.keys(totals).reduce((accum, key) => {
            return (accum + totals[key]);
        }, 0);
        const progress = Object.keys(progresses).reduce((accum, key) => {
            return (accum + progresses[key]);
        }, 0);
        const percentage = total ? progress/total : 0;

        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                    <ActivityIndicator
                        size={'large'}
                        color={black}
                    />
                    <Text style={darkFontStyles.regular}>
                        {`Uploading ${numFinished+1}/${numToUpload}...`}
                    </Text>
                    <Progress.Bar
                        progress={percentage}
                        width={200}
                        color={'#678da2'}
                        borderColor={'#678da2'}
                    />
            </View>
        );
    }
}