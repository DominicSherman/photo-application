import React, {Component} from 'react';
import {darkFontStyles} from '../constants/font-styles';
import {StyleSheet, Text, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import {getCurrentTime} from '../constants/helper-functions';
import {uploadImage} from '../services/firebase-service';

export default class UploadButton extends Component {
    uploadImages = async () => {
        const {actions, selectedImages, user} = this.props;
        actions.setUploading(Object.keys(selectedImages).length);

        const sessionId = getCurrentTime();
        await Object.keys(selectedImages).forEach(async (key, index) => {
            const {image} = selectedImages[key];

            await uploadImage(
                actions,
                image,
                index,
                sessionId,
                user
            );
        });
    };

    render() {
        const {actions, selectedImages} = this.props;

        return (
            <View style={styles.centeredRow}>
                <Touchable
                    onPress={() => {
                        if (Object.keys(selectedImages).length) {
                            actions.setSelectedImages([]);
                            this.uploadImages();
                        }
                    }}
                >
                    <View style={styles.buttonView}>
                        <Text
                            style={[
                                darkFontStyles.regular,
                                {color: 'white', fontSize: 30}
                            ]}
                        >
                            {'UPLOAD'}
                        </Text>
                    </View>
                </Touchable>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        justifyContent: 'center'
    },
    buttonView: {
        width: '100%',
        paddingVertical: 40,
        paddingHorizontal: 80,
        borderColor: '#678da2',
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: '#678da2',
        justifyContent: 'center'
    },
    centeredRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 50
    }
});

