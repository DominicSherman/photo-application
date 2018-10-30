import React, {Component} from 'react';
import Touchable from 'react-native-platform-touchable';
import Entypo from 'react-native-vector-icons/Entypo';
import {Image, Text, StyleSheet, View} from 'react-native';

import {darkFontStyles} from '../constants/font-styles';
import {thumbnailImageSize} from '../constants/variables';

const styles = StyleSheet.create({
    imageThumbnail: {
        height: thumbnailImageSize,
        width: thumbnailImageSize
    },
    previewRow: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%'
    },
    rowTextView: {
        flexDirection: 'column',
        justifyContent: 'center',
        width: '50%'
    }
});

export default class PreviewRow extends Component {
    render() {
        const {selectedImage, toggleSelected} = this.props;

        return (
            <View style={styles.previewRow}>
                <Image
                    source={{uri: selectedImage.image.uri}}
                    style={styles.imageThumbnail}
                />
                <View style={styles.rowTextView}>
                    <Text
                        numberOfLines={1}
                        style={darkFontStyles.light}
                    >
                        {selectedImage.image.filename}
                    </Text>
                </View>
                <Touchable
                    onPress={() => toggleSelected(selectedImage)}
                >
                    <Entypo
                        color={'red'}
                        name={'circle-with-minus'}
                        size={20}
                    />
                </Touchable>
            </View>
        );
    }
}
