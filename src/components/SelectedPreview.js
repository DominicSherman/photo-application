import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {darkFontStyles} from '../constants/font-styles';

import PreviewRow from './PreviewRow';

const styles = StyleSheet.create({
    textView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 7
    },
    wrapperView: {
        flex: 1,
        paddingBottom: '6%',
        paddingTop: '5%'
    }
});

export default class SelectedPreview extends Component {
    render() {
        const {actions, selectedImages} = this.props;

        return (
            <View style={styles.wrapperView}>
                <View style={styles.textView}>
                    <Text style={[darkFontStyles.regular]}>
                        {`${Object.keys(selectedImages).length} selected`}
                    </Text>
                </View>
                {Object.keys(selectedImages).map((key) =>
                    <PreviewRow
                        key={key}
                        selectedImage={selectedImages[key]}
                        toggleSelected={actions.toggleSelected}
                    />
                )}
            </View>
        );
    }
}
