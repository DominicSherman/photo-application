import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import Entypo from 'react-native-vector-icons/Entypo';

import {getCurrentTime} from '../services/helper-functions';
import {uploadImage} from '../services/firebase-service';
import {lightFontStyles} from '../constants/font-styles';

const styles = StyleSheet.create({
    buttonView: {
        backgroundColor: '#678da2',
        borderColor: '#678da2',
        borderRadius: 10,
        borderWidth: 1,
        justifyContent: 'center',
        paddingHorizontal: 80,
        paddingVertical: 40,
        width: '100%'
    },
    centeredRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 50,
        marginBottom: 25
    },
    text: {
        color: 'white',
        fontSize: 30
    },
    wrapper: {
        justifyContent: 'center'
    }
});

export default class UploadButton extends Component {
    uploadImages = async () => {
        const {actions, selectedImages, user} = this.props;

        actions.setUploading(Object.keys(selectedImages).length);

        const sessionId = getCurrentTime();

        await Object.keys(selectedImages).forEach(async (key, index) => {
            const {image} = selectedImages[key];

            await uploadImage({
                actions,
                image,
                index,
                sessionId,
                user
            });
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
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Entypo
                            name={'upload-to-cloud'}
                            size={120}
                        />
                        <Text style={lightFontStyles.regular}>{'Upload'}</Text>
                    </View>
                </Touchable>
            </View>
        );
    }
}
