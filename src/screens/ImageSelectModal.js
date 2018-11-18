import React, {Component} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View, CameraRoll, Platform} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import {darkFontStyles, lightFontStyles} from '../constants/font-styles';
import CameraRollRow from '../components/CameraRollRow';
import {dismissModal} from '../services/navigation-service';
import {requestExternalStorage} from '../services/permission-service';
import {numPictures} from '../constants/variables';

import LoadingView from './LoadingView';

const styles = StyleSheet.create({
    header: {
        alignContent: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10
    }
});

export default class ImageSelectModal extends Component {
    async componentWillMount() {
        if (Platform.OS === 'ios' || await requestExternalStorage()) {
            CameraRoll.getPhotos({
                assetType: 'All',
                first: numPictures
            }).then((r) => this.props.actions.setCameraRollRows(r));
        }
    }

    render() {
        const {
            actions,
            cameraRollRows,
            selectedImages
        } = this.props;

        if (!cameraRollRows.length) {
            return <LoadingView />;
        }

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
