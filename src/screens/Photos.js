import React, {Component} from 'react';
import PhotoGrid from 'react-native-thumbnail-grid';
import {Dimensions, ScrollView, Text, View} from 'react-native';

import {lightFontStyles} from '../constants/font-styles';

import LoadingView from './LoadingView';

export default class Photos extends Component {
    componentWillMount() {
        this.props.actions.setMedia();
    }

    render() {
        const {pictures} = this.props;

        console.log('pictures', pictures);

        if (!pictures) {
            return <LoadingView />;
        }

        if (!pictures.length) {
            return (
                <View
                    style={{
                        alignItems: 'center',
                        flex: 1,
                        justifyContent: 'center',
                        paddingHorizontal: '10%'
                    }}
                >
                    <Text style={[lightFontStyles.regular, {fontSize: 25}]}>
                        {'No pictures have been uploaded yet 😕'}
                    </Text>
                </View>
            );
        }

        return (
            <ScrollView>
                <PhotoGrid
                    height={Dimensions.get('window').height}
                    onPressImage={() => ({})}
                    source={pictures}
                />
            </ScrollView>
        );
    }
}
