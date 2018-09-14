import React, {Component} from 'react';
import {darkFontStyles} from '../constants/font-styles';
import {thumbnailImageSize} from '../constants/variables';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';

export default class SelectedPreview extends Component {
    render() {
        const {selectedImages} = this.props;

        return (
            <ScrollView style={styles.scrollView}>
                {
                    Object.keys(selectedImages).map((key) =>
                        selectedImages[key] ?
                            <View
                                key={key}
                                style={styles.previewRow}
                            >
                                <Image
                                    style={styles.imageThumbnail}
                                    source={{uri: selectedImages[key].image.uri}}
                                />
                                <Text style={darkFontStyles.light}>{selectedImages[key].image.filename}</Text>
                            </View>
                            :
                            null
                    )
                }
            </ScrollView>
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
        marginTop: '10%'
    }
});