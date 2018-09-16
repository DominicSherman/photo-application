import React, {Component} from 'react';
import {darkFontStyles} from '../constants/font-styles';
import {thumbnailImageSize} from '../constants/variables';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';

export default class SelectedPreview extends Component {
    render() {
        const {selectedImages} = this.props;
        const keys = Object.keys(selectedImages).filter((key) => selectedImages[key]);

        return (
            <View>
                <View style={styles.textView}>
                    <Text style={[darkFontStyles.regular]}>
                        {`${keys.length} selected`}
                    </Text>
                </View>
                <ScrollView style={styles.scrollView}>
                    {
                        keys.map((key) =>
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
        marginTop: '10%',
        height: '45%'
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