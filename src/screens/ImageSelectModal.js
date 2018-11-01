import React, {Component} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import {darkFontStyles, lightFontStyles} from '../constants/font-styles';
import CameraRollRow from '../components/CameraRollRow';
import {dismissModal} from '../services/navigation-service';

const styles = StyleSheet.create({
    header: {
        alignContent: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10
    }
});

export default class ImageSelectModal extends Component {
    render() {
        const {
            actions,
            cameraRollRows,
            selectedImages
        } = this.props;

        return (
            <SafeAreaView>
                <View style={styles.header}>
                    <Touchable
                        onPress={() => {
                            dismissModal(this.props.componentId);
                            actions.setSelectedImages([]);
                        }}
                    >
                        <EvilIcons
                            name={'close'}
                            size={30}
                        />
                    </Touchable>
                    <Text style={lightFontStyles.light}>{'Select Images to Upload'}</Text>
                    <Text
                        onPress={() => dismissModal(this.props.componentId)}
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
                            images={item}
                            selectedImages={selectedImages}
                        />
                    }
                />
            </SafeAreaView>
        );
    }
}
