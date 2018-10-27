import React, {Component} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';

import {thumbnailImageSize} from '../constants/variables';
import {darkFontStyles} from '../constants/font-styles';

const styles = StyleSheet.create({
    imageThumbnail: {
        height: thumbnailImageSize,
        width: thumbnailImageSize
    },
    previewRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%'
    },
    rowTextView: {
        flexDirection: 'column',
        justifyContent: 'center',
        width: '50%'
    },
    scrollView: {
        height: '100%',
        marginTop: '3%'
    },
    textView: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 7
    },
    wrapperView: {
        height: '40%',
        marginBottom: '2%'
    }
});

export default class SelectedPreview extends Component {
    render() {
        const {selectedImages} = this.props;

        return (
            <View style={styles.wrapperView}>
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
                                    source={{uri: selectedImages[key].image.uri}}
                                    style={styles.imageThumbnail}
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
