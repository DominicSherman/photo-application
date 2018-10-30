import React, {Component} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import Entypo from 'react-native-vector-icons/Entypo';

import {thumbnailImageSize} from '../constants/variables';
import {darkFontStyles} from '../constants/font-styles';

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
    },
    scrollView: {
        height: '100%',
        marginTop: '3%'
    },
    textView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 7
    },
    wrapperView: {
        flex: 1,
        paddingBottom: '6%'
    }
});

export default class SelectedPreview extends Component {
    render() {
        const {actions, selectedImages} = this.props;

        const PreviewRows = () => Object.keys(selectedImages).map((key) =>
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
                <Touchable
                    onPress={() => actions.toggleSelected(selectedImages[key])}
                >
                    <Entypo
                        color={'red'}
                        name={'circle-with-minus'}
                        size={20}
                    />
                </Touchable>
            </View>
        );

        return (
            <View style={styles.wrapperView}>
                <View style={styles.textView}>
                    <Text style={[darkFontStyles.regular]}>
                        {`${Object.keys(selectedImages).length} selected`}
                    </Text>
                </View>
                <PreviewRows />
            </View>
        );
    }
}
