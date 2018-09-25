import React, {Component} from 'react';
import {darkFontStyles} from '../constants/font-styles';
import {FlatList, Modal, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import CameraRollRow from '../components/CameraRollRow';

export default class ImageSelectModal extends Component {
    render() {
        const {
            actions,
            cameraRollRows,
            selectedImages,
            imageModalVisible
        } = this.props;

        return (
            <Modal
                animationType={'slide'}
                transparent={false}
                visible={imageModalVisible}
            >
                <SafeAreaView>
                    <View style={styles.header}>
                        <Touchable
                            onPress={() => {
                                actions.toggleImageModal();
                                actions.setSelectedImages([]);
                            }}
                        >
                            <EvilIcons
                                name={'close'}
                                size={30}
                            />
                        </Touchable>
                        <Text
                            onPress={actions.toggleImageModal}
                            style={[
                                darkFontStyles.regular,
                                {color: 'blue'}
                            ]}
                        >
                            {'Done'}
                        </Text>
                    </View>
                    <FlatList
                        data={cameraRollRows}
                        extraData={selectedImages}
                        keyExtractor={(item, index) => `${index}`}
                        renderItem={({item}) =>
                            <CameraRollRow
                                actions={actions}
                                selectedImages={selectedImages}
                                images={item}
                            />
                        }
                    />
                </SafeAreaView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        alignContent: 'center'
    }
});
