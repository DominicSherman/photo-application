import React, {Component} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';

import {thumbnailImageSize} from '../constants/variables';
import {darkFontStyles} from '../constants/font-styles';

const styles = StyleSheet.create({
    imageThumbnail: {
        width: thumbnailImageSize,
        height: thumbnailImageSize
    },
    previewRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly'
    },
    scrollView: {
        marginTop: '3%',
        height: '85%'
    },
    textView: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 7
    },
    rowTextView: {
        width: '50%',
        flexDirection: 'column',
        justifyContent: 'center'
    }
});

export default class SelectedPreview extends Component {
    render() {
        const {selectedImages} = this.props;

        return (
            <View>
                <View style={styles.textView}>
                    <Text style={[darkFontStyles.regular]}>
                        {`${Object.keys(selectedImages).length} selected`}
                    </Text>
                </View>
                <ScrollView style={styles.scrollView}>
                    {
                        Object.keys(selectedImages).map((key) =>
                            <View
                                key={key}
                                style={styles.previewRow}
                            >
                                <Image
                                    style={styles.imageThumbnail}
                                    source={{uri: selectedImages[key].image.uri}}
                                />
                                <View style={styles.rowTextView}>
                                    <Text
                                        numberOfLines={1}
                                        style={darkFontStyles.light}
                                    >
                                        {selectedImages[key].image.filename}
                                    </Text>
                                </View>
                            </View>
                        )
                    }
                </ScrollView>
            </View>
        );
    }
}